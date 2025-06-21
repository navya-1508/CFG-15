import mongoose from "mongoose";
import User from "../models/User.js";
import Course from "../models/Course.js";
import Session from "../models/Session.js";
import Progress from "../models/Progress.js";

const getProfile = async (req, res) => {
  try {
    const userId = req.userId;

    console.log(`Profile: Attempting to fetch profile for userId: ${userId}`);
    console.log(
      `Profile: Request object contains: userId=${req.userId}, role=${req.role}`
    );

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log(`Profile: Invalid ObjectId format: ${userId}`);
      return res.status(400).json({
        message: "Invalid user ID format",
        details: {
          providedId: userId,
          expectedFormat: "Valid MongoDB ObjectId",
        },
      });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      console.log(`Profile: No user found with ID: ${userId}`);

      // Check if the user exists in any model as a fallback
      const counts = {
        users: await User.countDocuments(),
        // Include any other models that might contain users
      };
      console.log("Profile: Database user counts:", counts);

      return res.status(404).json({ message: "User not found" });
    }

    console.log(`Profile: User found: ${user.username}, role: ${user.role}`);
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { username, email, language, profilePicture } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (language) user.language = language;
    if (profilePicture) user.profilePicture = profilePicture;

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        language: user.language,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error(`Error updating user profile: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getDashboard = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "user") {
      return res.status(200).json({
        user: {
          id: user._id,
          username: user.username,
          role: user.role,
        },
        message:
          "Regular users don't have access to course. Please register as an champion to access the course.",
      });
    }
    if (user.role === "champion" || user.role === "saathi") {
      // Safely handle the case when courses/sessions might not exist yet
      let progress = [];
      let courses = [];
      let sessions = [];

      try {
        // Try to get progress data if it exists
        progress = await Progress.find({ userId })
          .populate({
            path: "sessionId",
            select: "title courseId",
            populate: {
              path: "courseId",
              select: "title",
            },
          })
          .catch((err) => {
            console.log("No progress data available yet");
            return [];
          });

        // Try to get courses if they exist
        courses = await Course.find()
          .select("title description")
          .catch((err) => {
            console.log("No courses available yet");
            return [];
          });

        // Try to get sessions if they exist
        sessions = await Session.find().catch((err) => {
          console.log("No sessions available yet");
          return [];
        });
      } catch (err) {
        console.log("Error fetching dashboard data:", err);
        // Continue with empty arrays
      }

      // Calculate progress safely
      const completedSessions = progress.filter((p) => p.completed).length;
      const totalSessions = sessions.length;
      const overallProgress =
        totalSessions > 0
          ? Math.round((completedSessions / totalSessions) * 100)
          : 0; // Get badges and certificates information
      const badgeCount = user.badges ? user.badges.length : 0;
      const certificateCount = user.certificates ? user.certificates.length : 0;

      // Get recent badges (up to 5)
      const recentBadges = user.badges
        ? user.badges
            .sort((a, b) => new Date(b.earnedOn) - new Date(a.earnedOn))
            .slice(0, 5)
        : [];

      return res.status(200).json({
        user: {
          id: user._id,
          username: user.username,
          role: user.role,
        },
        progress: {
          overall: overallProgress,
          completed: completedSessions,
          total: totalSessions,
        },
        badges: {
          count: badgeCount,
          recent: recentBadges,
        },
        certificates: {
          count: certificateCount,
          earned: user.certificates || [],
        },
        courses,
        steps: [
          "Take Pre-Test",
          "Complete Sessions",
          "Earn Badges",
          "Chat with Saathis and mentors",
          "Submit Grievances if needed",
          "Complete the course and get Certificate",
          "Submit Exit/Promotion Form",
        ],
      });
    }

    res.status(403).json({ message: "Unauthorized access" });
  } catch (error) {
    console.error(`Error getting dashboard: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get available courses (only for champions and saathis)
const getCourses = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // No need to check roles here since we're using authorize middleware in routes
    try {
      const courses = await Course.find();

      if (!courses || courses.length === 0) {
        // If no courses exist yet
        return res.status(200).json({
          courses: [],
          message: "No courses are available yet. Please check back later.",
        });
      }

      return res.status(200).json({ courses });
    } catch (err) {
      console.error("Error finding courses:", err);
      return res.status(200).json({
        courses: [],
        message:
          "There was an issue retrieving courses. Please try again later.",
      });
    }
  } catch (error) {
    console.error(`Error getting courses: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get course details including sessions (for champions and saathis only)
const getCourseById = async (req, res) => {
  try {
    const userId = req.userId;
    const courseId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // No need to check roles here since we're using authorize middleware in routes

    // Check if courseId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID format" });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Get sessions for this course safely
    let sessions = [];
    try {
      sessions = await Session.find({ courseId }).sort({ order: 1 });
    } catch (err) {
      console.log("Error finding sessions:", err);
      // Continue with empty sessions array
    }

    // Get user progress for this course safely
    let progress = [];
    if (sessions.length > 0) {
      try {
        progress = await Progress.find({
          userId,
          sessionId: { $in: sessions.map((s) => s._id) },
        });
      } catch (err) {
        console.log("Error finding progress:", err);
        // Continue with empty progress array
      }
    } // Add progress and badge info to each session
    const sessionsWithProgress = sessions.map((session) => {
      const sessionProgress = progress.find(
        (p) => p.sessionId.toString() === session._id.toString()
      );

      // Check if user has earned a badge for this session
      const badge =
        user.badges &&
        user.badges.find(
          (b) => b.sessionId.toString() === session._id.toString()
        );

      return {
        _id: session._id,
        title: session.title,
        order: session.order,
        description: session.description,
        completed: sessionProgress ? sessionProgress.completed : false,
        completedOn: sessionProgress ? sessionProgress.completedOn : null,
        badge: badge
          ? {
              name: badge.name,
              earnedOn: badge.earnedOn,
            }
          : null,
      };
    });

    return res.status(200).json({
      course,
      sessions: sessionsWithProgress,
    });
  } catch (error) {
    console.error(`Error getting course details: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get session details (for champions and saathis only)
const getSessionById = async (req, res) => {
  try {
    const userId = req.userId;
    const sessionId = req.params.id;

    // Extra validation for sensitive endpoints
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User ID not found in token" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // No need to check roles here since we're using authorize middleware in routes

    // Check if sessionId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({ message: "Invalid session ID format" });
    }

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Get user progress for this session safely
    let progress = null;
    try {
      progress = await Progress.findOne({ userId, sessionId });
    } catch (err) {
      console.log("Error finding progress:", err);
      // Continue with null progress
    }

    // Filter resources by user's preferred language if specified
    let filteredResources = session.resourcesByLanguage || [];

    if (user.language) {
      // Try to find resources in user's preferred language
      const userLangResources = session.resourcesByLanguage.find(
        (r) => r.language === user.language
      );

      // If found, only show those, otherwise show all
      if (userLangResources) {
        filteredResources = [userLangResources];
      }
    }
    return res.status(200).json({
      session: {
        ...session.toObject(),
        resourcesByLanguage: filteredResources,
      },
      progress: progress
        ? {
            completed: progress.completed,
            completedOn: progress.completedOn,
            videoWatched: progress.videoDetails
              ? progress.videoDetails.watched
              : false,
            watchDuration: progress.videoDetails
              ? progress.videoDetails.watchDuration
              : 0,
            watchedOn: progress.videoDetails
              ? progress.videoDetails.watchedOn
              : null,
          }
        : { completed: false, videoWatched: false },
    });
  } catch (error) {
    console.error(`Error getting session details: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Mark session as completed (for champions and saathis only)
const completeSession = async (req, res) => {
  try {
    const userId = req.userId;
    const sessionId = req.params.id;

    // Check if request body exists
    if (!req.body) {
      return res.status(400).json({
        message: "Request body is missing",
        error: "MISSING_REQUEST_BODY",
      });
    }

    const { videoWatched, watchDuration, videoId } = req.body;

    // Extra validation for sensitive endpoints
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User ID not found in token" });
    }

    // Validate that the video was actually watched
    if (!videoWatched) {
      return res.status(400).json({
        message: "You must watch the video to complete this session",
        error: "VIDEO_NOT_WATCHED",
      });
    }

    // Validate that watch duration was provided (in seconds)
    if (!watchDuration) {
      return res.status(400).json({
        message: "Video watch duration is required",
        error: "MISSING_WATCH_DURATION",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // No need to check roles here since we're using authorize middleware in routes

    // Find the session to validate it exists
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Find the video resource in the session
    let videoResourceFound = false;
    let expectedVideoDuration = 0;

    // Check if the session has any resources
    if (session.resourcesByLanguage && session.resourcesByLanguage.length > 0) {
      // Look through all language resources
      for (const langResource of session.resourcesByLanguage) {
        if (langResource.resources && langResource.resources.length > 0) {
          // Look for video resources
          const videos = langResource.resources.filter(
            (r) => r.type === "video"
          );

          if (videos.length > 0) {
            videoResourceFound = true;
            // If videoId is provided, verify it matches one of the videos
            if (videoId) {
              const matchingVideo = videos.find(
                (v) => v._id.toString() === videoId || v.url.includes(videoId)
              );
              if (matchingVideo) {
                // Video duration might be stored in the database, if available
                if (matchingVideo.duration) {
                  expectedVideoDuration = matchingVideo.duration;
                }
                break;
              }
            } else {
              // If no specific videoId provided, just confirm there's at least one video
              break;
            }
          }
        }
      }
    }

    // If no video resources found in this session, return an error
    if (!videoResourceFound) {
      return res.status(400).json({
        message: "No video resources found for this session",
        error: "NO_VIDEO_RESOURCE",
      });
    }

    // If we have expected video duration and actual watch duration is too short
    // (watched less than 80% of the video), reject the completion
    if (
      expectedVideoDuration > 0 &&
      watchDuration < expectedVideoDuration * 0.8
    ) {
      return res.status(400).json({
        message:
          "You must watch at least 80% of the video to complete this session",
        error: "INSUFFICIENT_WATCH_DURATION",
        watchedSeconds: watchDuration,
        expectedDuration: expectedVideoDuration,
        watchedPercentage: Math.round(
          (watchDuration / expectedVideoDuration) * 100
        ),
      });
    } // Find existing progress or create new
    let progress = await Progress.findOne({ userId, sessionId });
    const now = new Date();

    if (progress) {
      // Update existing progress
      progress.completed = true;
      progress.completedOn = now;

      // Update video watching details
      progress.videoDetails = {
        videoId: videoId || "unknown",
        watched: true,
        watchDuration: watchDuration,
        watchedOn: now,
      };
    } else {
      // Create new progress
      progress = new Progress({
        userId,
        sessionId,
        completed: true,
        completedOn: now,
        videoDetails: {
          videoId: videoId || "unknown",
          watched: true,
          watchDuration: watchDuration,
          watchedOn: now,
        },
      });
    }

    await progress.save();

    // Award a badge for completing the session
    const existingBadge =
      user.badges &&
      user.badges.find((b) => b.sessionId.toString() === sessionId);

    if (!existingBadge) {
      // Create a new badge for this session
      const badgeName = `${session.title} Completion Badge`;

      // Initialize badges array if it doesn't exist
      if (!user.badges) {
        user.badges = [];
      }

      // Add the badge
      user.badges.push({
        sessionId: session._id,
        courseId: session.courseId,
        name: badgeName,
        earnedOn: now,
      });

      await user.save();
    }
    return res.status(200).json({
      message: "Session marked as completed after watching the video",
      progress: {
        ...progress.toObject(),
        videoWatched: true,
        watchDuration: watchDuration,
      },
      badge: !existingBadge
        ? {
            name: `${session.title} Completion Badge`,
            earnedOn: now,
          }
        : null,
    });
  } catch (error) {
    console.error(`Error completing session: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Request saathi promotion (for champions)
const requestSaathiPromotion = async (req, res) => {
  try {
    const userId = req.userId;
    const { reason } = req.body;

    // Extra validation for sensitive endpoints
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User ID not found in token" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Only champions can request saathi promotion
    if (user.role !== "champion") {
      return res.status(403).json({
        message: "Only champions can request promotion to saathi",
      });
    }

    // Check if the user has earned a certificate
    if (!user.certificates || user.certificates.length === 0) {
      return res.status(403).json({
        message:
          "You must earn a certificate before requesting promotion to saathi",
        status: "CERTIFICATE_REQUIRED",
      });
    }

    // For a real implementation, create a PromotionRequest model
    // This is a placeholder implementation using the user document    // Create promotion request object
    const promotionRequest = {
      requestedAt: new Date(),
      currentRole: "champion",
      requestedRole: "saathi",
      reason,
      status: "pending",
    };

    // Update the user with the promotion request
    user.promotionRequest = promotionRequest;

    console.log("Saving promotion request for user:", user._id);
    console.log("Request details:", JSON.stringify(promotionRequest, null, 2));

    await user.save();

    // Verify the save was successful
    const updatedUser = await User.findById(user._id);
    console.log(
      "Verification - saved promotionRequest:",
      updatedUser.promotionRequest
        ? JSON.stringify(updatedUser.promotionRequest, null, 2)
        : "Not found"
    );

    res.status(200).json({
      message: "Saathi promotion request submitted successfully",
      promotionRequest,
    });
  } catch (error) {
    console.error(`Error requesting saathi promotion: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Submit a grievance (for all users)
const submitGrievance = async (req, res) => {
  try {
    const userId = req.userId;
    const { title, description, category } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // For a real implementation, create a Grievance model
    // This is a placeholder implementation using the user document

    // Create grievance object
    const grievance = {
      submittedAt: new Date(),
      title,
      description,
      category,
      status: "submitted",
    };

    // Update user with the grievance
    user.grievances = user.grievances || [];
    user.grievances.push(grievance);
    await user.save();

    res.status(201).json({
      message: "Grievance submitted successfully",
      grievance,
    });
  } catch (error) {
    console.error(`Error submitting grievance: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get certificate for completed course (for champions and saathis)
const getCertificate = async (req, res) => {
  try {
    const userId = req.userId;
    const courseId = req.params.courseId;

    // Extra validation for sensitive endpoints
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User ID not found in token" });
    }

    // Check eligibility for certificate
    const eligibility = await checkCertificateEligibility(userId, courseId);

    // If not eligible, return the reason
    if (!eligibility.eligible) {
      return res.status(eligibility.status).json({
        message: eligibility.message,
        ...eligibility,
      });
    }

    // Extract user and course from eligibility check
    const { user, course } = eligibility;
    // User is eligible for a certificate!
    // All 9 sessions are completed and all 9 badges earned

    // Generate a certificate and store it in the user document
    const issueDate = new Date();
    const certificateId = `CERT-${course._id
      .toString()
      .substring(0, 6)}-${Date.now()}`;

    const certificate = {
      userId: user._id,
      username: user.username,
      courseId: course._id,
      courseName: course.title,
      issueDate,
      certificateId,
    };

    // Initialize certificates array if it doesn't exist
    if (!user.certificates) {
      user.certificates = [];
    }

    // Check if user already has a certificate for this course
    const existingCertificate = user.certificates.find(
      (cert) => cert.courseId.toString() === courseId
    );

    if (!existingCertificate) {
      // Add the certificate to user's certificates
      user.certificates.push({
        courseId: course._id,
        certificateId,
        issueDate,
      });

      await user.save();
    }

    res.status(200).json({
      message: "Certificate generated successfully",
      certificate,
    });
  } catch (error) {
    console.error(`Error getting certificate: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Submit test score (pre-test or post-test)
const submitTestScore = async (req, res) => {
  try {
    const userId = req.userId;
    const { courseId, score, testType } = req.body;

    // Extra validation for sensitive endpoints
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User ID not found in token" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate required fields
    if (!courseId || score === undefined || !testType) {
      return res.status(400).json({
        message: "Missing required fields",
        required: ["courseId", "score", "testType"],
      });
    }

    // Validate test type
    if (testType !== "pre" && testType !== "post") {
      return res.status(400).json({
        message: "Invalid test type. Must be 'pre' or 'post'",
        received: testType,
      });
    }

    // Ensure courseId is valid
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID format" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Update the appropriate test score
    if (testType === "pre") {
      user.preTestScore = {
        courseId,
        score,
        takenOn: new Date(),
      };
    } else {
      user.postTestScore = {
        courseId,
        score,
        takenOn: new Date(),
      };
    }

    await user.save();

    res.status(200).json({
      message: `${
        testType === "pre" ? "Pre-test" : "Post-test"
      } score submitted successfully`,
      testScore: testType === "pre" ? user.preTestScore : user.postTestScore,
    });
  } catch (error) {
    console.error(`Error submitting test score: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all badges for the current user
const getUserBadges = async (req, res) => {
  try {
    const userId = req.userId;

    // Extra validation for sensitive endpoints
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User ID not found in token" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If no badges yet, return an empty array
    if (!user.badges || user.badges.length === 0) {
      return res.status(200).json({
        badges: [],
        message: "You haven't earned any badges yet.",
      });
    }

    // Get course details for each badge
    const badgesWithDetails = await Promise.all(
      user.badges.map(async (badge) => {
        let sessionTitle = "Unknown Session";
        let courseTitle = "Unknown Course";

        try {
          const session = await Session.findById(badge.sessionId);
          if (session) {
            sessionTitle = session.title;

            const course = await Course.findById(badge.courseId);
            if (course) {
              courseTitle = course.title;
            }
          }
        } catch (err) {
          console.log("Error fetching badge details:", err);
        }

        return {
          ...badge.toObject(),
          sessionTitle,
          courseTitle,
        };
      })
    );

    return res.status(200).json({
      badges: badgesWithDetails,
      totalCount: badgesWithDetails.length,
    });
  } catch (error) {
    console.error(`Error getting user badges: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Helper function to check certificate eligibility for a user in a course
const checkCertificateEligibility = async (userId, courseId) => {
  // Constants
  const REQUIRED_SESSIONS = 9;

  // Get the user
  const user = await User.findById(userId);
  if (!user) {
    return {
      eligible: false,
      message: "User not found",
      status: 404,
    };
  }

  // Check if course exists
  const course = await Course.findById(courseId);
  if (!course) {
    return {
      eligible: false,
      message: "Course not found",
      status: 404,
    };
  }

  // Get all sessions for this course
  let sessions = await Session.find({ courseId });

  if (sessions.length === 0) {
    return {
      eligible: false,
      message: "No sessions found for this course",
      status: 404,
    };
  }

  // Check if course has exactly 9 sessions
  if (sessions.length !== REQUIRED_SESSIONS) {
    return {
      eligible: false,
      message: `Course must have exactly ${REQUIRED_SESSIONS} sessions to issue certificates`,
      courseId: courseId,
      currentSessions: sessions.length,
      requiredSessions: REQUIRED_SESSIONS,
      status: 403,
    };
  }

  // Check if user completed all sessions
  const progress = await Progress.find({
    userId,
    sessionId: { $in: sessions.map((s) => s._id) },
    completed: true,
  });

  if (progress.length < REQUIRED_SESSIONS) {
    return {
      eligible: false,
      message: `Must complete all ${REQUIRED_SESSIONS} sessions in this course to get a certificate`,
      completed: progress.length,
      required: REQUIRED_SESSIONS,
      status: 403,
    };
  }

  // Check if user has earned all badges for this course
  const badgesForCourse = user.badges
    ? user.badges.filter(
        (badge) => badge.courseId.toString() === courseId.toString()
      )
    : [];

  if (badgesForCourse.length < REQUIRED_SESSIONS) {
    return {
      eligible: false,
      message: `Must earn all ${REQUIRED_SESSIONS} badges for this course to get a certificate`,
      earnedBadges: badgesForCourse.length,
      requiredBadges: REQUIRED_SESSIONS,
      missingBadges: REQUIRED_SESSIONS - badgesForCourse.length,
      status: 403,
    };
  }

  // All checks passed
  return {
    eligible: true,
    message: "Eligible for certificate",
    user,
    course,
    status: 200,
  };
};

// Check eligibility for a certificate without generating one
const checkCertificateStatus = async (req, res) => {
  try {
    const userId = req.userId;
    const courseId = req.params.courseId;

    // Extra validation for sensitive endpoints
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User ID not found in token" });
    }

    // Check eligibility
    const eligibility = await checkCertificateEligibility(userId, courseId);

    // Return the eligibility status regardless of whether eligible or not
    return res.status(200).json({
      eligible: eligibility.eligible,
      message: eligibility.message,
      courseId,
      ...eligibility,
      // Don't include user and course objects in response
      user: undefined,
      course: eligibility.course
        ? {
            id: eligibility.course._id,
            title: eligibility.course.title,
          }
        : undefined,
    });
  } catch (error) {
    console.error(`Error checking certificate eligibility: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all pending promotion requests (for admins only)
const getPromotionRequests = async (req, res) => {
  try {
    // Only admins can view pending requests
    if (req.role !== "admin") {
      return res.status(403).json({
        message:
          "Not authorized to view promotion requests. Only admins can access this feature.",
      });
    }

    console.log("Searching for users with pending promotion requests...");

    // First check if there are any users with promotionRequest field
    const allRequestsCount = await User.countDocuments({
      promotionRequest: { $exists: true },
    });
    console.log(`Total users with any promotion requests: ${allRequestsCount}`);

    // Find users with pending promotion requests
    const usersWithRequests = await User.find({
      "promotionRequest.status": "pending",
    }).select("username email role promotionRequest");

    console.log(`Found ${usersWithRequests.length} pending promotion requests`);

    // If no requests found but there are users with promotion requests, check their status
    if (usersWithRequests.length === 0 && allRequestsCount > 0) {
      const otherRequests = await User.find({
        promotionRequest: { $exists: true },
      }).select("username promotionRequest.status");

      console.log("Other promotion requests with different statuses:");
      console.log(JSON.stringify(otherRequests, null, 2));
    }

    res.status(200).json({
      requests: usersWithRequests,
      count: usersWithRequests.length,
      debug: {
        totalRequestsCount: allRequestsCount,
      },
    });
  } catch (error) {
    console.error(`Error fetching promotion requests: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Process (approve/reject) a promotion request (for admins only)
const processPromotionRequest = async (req, res) => {
  try {
    const { userId, approved, feedback } = req.body;

    // Only admins can process requests
    if (req.role !== "admin") {
      return res.status(403).json({
        message:
          "Not authorized to process promotion requests. Only admins can approve/reject requests.",
      });
    }

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    if (approved === undefined) {
      return res.status(400).json({
        message: "Decision (approved) field is required",
      });
    }

    // Find the user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user has a pending request
    if (!user.promotionRequest || user.promotionRequest.status !== "pending") {
      return res.status(400).json({
        message: "User does not have a pending promotion request",
      });
    }

    if (approved) {
      // Verify the user is a champion
      if (user.role !== "champion") {
        return res.status(400).json({
          message: "Only champions can be promoted to saathi",
        });
      }

      // Verify the user has a certificate
      if (!user.certificates || user.certificates.length === 0) {
        return res.status(400).json({
          message:
            "User must have earned a certificate to be promoted to saathi",
          status: "CERTIFICATE_REQUIRED",
        });
      }

      // Update user role
      user.role = "saathi";

      // Update promotion request status
      user.promotionRequest.status = "approved";
      user.promotionRequest.processedAt = new Date();
      user.promotionRequest.processedBy = req.userId;
      user.promotionRequest.feedback =
        feedback ||
        "Congratulations! Your request to become a Saathi has been approved.";
    } else {
      // Update promotion request status only
      user.promotionRequest.status = "rejected";
      user.promotionRequest.processedAt = new Date();
      user.promotionRequest.processedBy = req.userId;
      user.promotionRequest.feedback =
        feedback || "Your request to become a Saathi has been declined.";
    }

    await user.save();

    res.status(200).json({
      message: `Promotion request ${
        approved ? "approved" : "rejected"
      } successfully`,
      user: {
        id: user._id,
        username: user.username,
        previousRole: "champion",
        currentRole: user.role,
        promotionRequest: user.promotionRequest,
      },
    });
  } catch (error) {
    console.error(`Error processing promotion request: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Export all controller functions
export {
  getProfile,
  updateProfile,
  getDashboard,
  getCourses,
  getCourseById,
  getSessionById,
  completeSession,
  requestSaathiPromotion,
  submitGrievance,
  getCertificate,
  submitTestScore,
  getUserBadges,
  checkCertificateEligibility,
  checkCertificateStatus,
  getPromotionRequests,
  processPromotionRequest,
};
