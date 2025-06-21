import mongoose from "mongoose";
import Course from "../models/Course.js";
import Session from "../models/Session.js";
import User from "../models/User.js";
import Teacher from "../models/Teacher.js";
import Admin from "../models/Admin.js";
import Progress from "../models/Progress.js";
import MCQQuestion from "../models/MCQQuestion.js";
import Test from "../models/Test.js";

const createCourse = async (req, res) => {
  try {
    // Check for authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Authentication required. Bearer token missing." });
    }

    // Check if user is authenticated
    if (!req.userId) {
      return res
        .status(401)
        .json({ message: "Authentication required. User ID not found." });
    }

    const { title, description, languageStaff } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Course title is required" });
    }

    if (languageStaff && languageStaff.length > 0) {
      for (const staff of languageStaff) {
        if (!staff.language || !staff.trainer || !staff.mentor) {
          return res.status(400).json({
            message:
              "Language, trainer, and mentor are required for each language staff",
          });
        }

        const trainerExists = await Teacher.findById(staff.trainer);
        if (!trainerExists || trainerExists.role !== "trainer") {
          return res.status(400).json({
            message: `Trainer with ID ${staff.trainer} not found or not a trainer`,
          });
        }

        const mentorExists = await Teacher.findById(staff.mentor);
        if (!mentorExists || mentorExists.role !== "mentor") {
          return res.status(400).json({
            message: `Mentor with ID ${staff.mentor} not found or not a mentor`,
          });
        }
      }
    }

    const newCourse = new Course({
      title,
      description,
      languageStaff: languageStaff || [],
    });

    const savedCourse = await newCourse.save();

    res.status(201).json({
      message: "Course created successfully",
      course: savedCourse,
    });
  } catch (error) {
    console.error(`Error creating course: ${error.message}`);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("languageStaff.trainer", "username email")
      .populate("languageStaff.mentor", "username email");

    res.status(200).json(courses);
  } catch (error) {
    console.error(`Error getting courses: ${error.message}`);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID format" });
    }

    const course = await Course.findById(courseId)
      .populate("languageStaff.trainer", "username email")
      .populate("languageStaff.mentor", "username email");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(course);
  } catch (error) {
    console.error(`Error getting course: ${error.message}`);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update course
const updateCourse = async (req, res) => {
  try {
    // Check for authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Authentication required. Bearer token missing." });
    }

    // Check if user is authenticated
    if (!req.userId) {
      return res
        .status(401)
        .json({ message: "Authentication required. User ID not found." });
    }

    const { courseId } = req.params;
    const { title, description, languageStaff } = req.body;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID format" });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Update fields
    if (title) course.title = title;
    if (description) course.description = description;

    // Update languageStaff if provided
    if (languageStaff && languageStaff.length > 0) {
      course.languageStaff = languageStaff;
    }

    await course.save();

    res.status(200).json({
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    console.error(`Error updating course: ${error.message}`);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create a new session for a course (admin only)
const createSession = async (req, res) => {
  try {
    // Check for authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Authentication required. Bearer token missing." });
    }

    // Check if user is authenticated
    if (!req.userId) {
      return res
        .status(401)
        .json({ message: "Authentication required. User ID not found." });
    }

    const { courseId, title, order, description } = req.body;
    const userId = req.user.id; // Get user ID from request (set by authentication middleware)

    // Check if the user is an admin
    const admin = await Admin.findById(userId);
    if (!admin) {
      return res
        .status(403)
        .json({ message: "Only admins can create sessions" });
    }

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID format" });
    }

    // Validate required fields
    if (!title || !description || order === undefined) {
      return res
        .status(400)
        .json({ message: "Title, description, and order are required" });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Create session with empty resources
    const newSession = new Session({
      courseId,
      title,
      order,
      description,
      resourcesByLanguage: [], // Start with empty resources - trainers will add them later
    });

    const savedSession = await newSession.save();

    res.status(201).json({
      message: "Session created successfully",
      session: savedSession,
    });
  } catch (error) {
    console.error(`Error creating session: ${error.message}`);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getSessionsByCourseId = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID format" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const sessions = await Session.find({ courseId }).sort({ order: 1 });

    res.status(200).json(sessions);
  } catch (error) {
    console.error(`Error getting sessions: ${error.message}`);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get session by ID
const getSessionById = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({ message: "Invalid session ID format" });
    }

    const session = await Session.findById(sessionId)
      .populate({
        path: "resourcesByLanguage.resources.uploadedBy",
        select: "username email",
      })
      .populate({
        path: "resourcesByLanguage.resources.approvedBy",
        select: "username email",
      });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.status(200).json(session);
  } catch (error) {
    console.error(`Error getting session: ${error.message}`);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update session
const updateSession = async (req, res) => {
  try {
    // Check for authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Authentication required. Bearer token missing." });
    }

    // Check if user is authenticated
    if (!req.userId) {
      return res
        .status(401)
        .json({ message: "Authentication required. User ID not found." });
    }

    const { sessionId } = req.params;
    const { title, description, order } = req.body;

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({ message: "Invalid session ID format" });
    }

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Update fields
    if (title) session.title = title;
    if (description) session.description = description;
    if (order !== undefined) session.order = order;

    await session.save();

    res.status(200).json({
      message: "Session updated successfully",
      session,
    });
  } catch (error) {
    console.error(`Error updating session: ${error.message}`);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Add a resource to a session
const addResource = async (req, res) => {
  try {
    // Check for authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Authentication required. Bearer token missing." });
    }

    // Check if user is authenticated
    if (!req.userId) {
      return res
        .status(401)
        .json({ message: "Authentication required. User ID not found." });
    }

    const { sessionId } = req.params;
    const { language, type, title, uploadedBy } = req.body;
    let { url } = req.body;

    // Handle uploaded file if present
    if (req.file) {
      // If a file was uploaded, use its path as the URL
      url = `/uploads/resources/${req.file.filename}`;
    }

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({ message: "Invalid session ID format" });
    }

    // Validate required fields
    if (!language || !type || !title || !uploadedBy) {
      return res.status(400).json({
        message: "Language, type, title, and uploadedBy are required",
      });
    }

    // If no file was uploaded and no URL was provided in the request body
    if (!req.file && !url) {
      return res.status(400).json({
        message: "Either a file must be uploaded or a URL must be provided",
      });
    }

    // Check if session exists
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    } // Check if teacher exists
    const teacher = await Teacher.findById(uploadedBy);
    if (!teacher) {
      return res
        .status(400)
        .json({ message: `Teacher with ID ${uploadedBy} not found` });
    }

    // Check if the authenticated user is uploading as themselves or is an admin
    if (req.role !== "admin" && req.userId !== uploadedBy) {
      return res
        .status(403)
        .json({ message: "You can only upload resources as yourself" });
    }

    // Ensure type is valid
    if (!["video", "pdf", "link"].includes(type)) {
      return res
        .status(400)
        .json({ message: "Resource type must be 'video', 'pdf', or 'link'" });
    }

    // If it's a file upload, ensure the type matches the file
    if (req.file) {
      if (
        (type === "video" && !req.file.mimetype.startsWith("video/")) ||
        (type === "pdf" && req.file.mimetype !== "application/pdf")
      ) {
        return res.status(400).json({
          message: "File type doesn't match the specified resource type",
        });
      }
    }

    // Create new resource
    const newResource = {
      type,
      title,
      url,
      uploadedBy,
      approved: false,
      fileName: req.file ? req.file.originalname : undefined,
      fileSize: req.file ? req.file.size : undefined,
      mimeType: req.file ? req.file.mimetype : undefined,
      uploadedAt: new Date(),
    };

    // Find language index or create new language entry
    let languageIndex = session.resourcesByLanguage.findIndex(
      (r) => r.language === language
    );

    if (languageIndex === -1) {
      // Language not found, add new language entry
      session.resourcesByLanguage.push({
        language,
        resources: [newResource],
      });
    } else {
      // Language found, add resource to existing language
      session.resourcesByLanguage[languageIndex].resources.push(newResource);
    }

    await session.save();

    res.status(201).json({
      message: "Resource added successfully",
      session,
    });
  } catch (error) {
    console.error(`Error adding resource: ${error.message}`);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Approve or reject a resource (for mentors)
const approveResource = async (req, res) => {
  try {
    // Check for authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Authentication required. Bearer token missing." });
    }

    // Check if user is authenticated
    if (!req.userId) {
      return res
        .status(401)
        .json({ message: "Authentication required. User ID not found." });
    }

    const { sessionId } = req.params;
    const { language, resourceId, mentorId, action } = req.body;

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({ message: "Invalid session ID format" });
    }

    // Validate required fields
    if (!language || !resourceId || !mentorId) {
      return res.status(400).json({
        message: "Language, resourceId, and mentorId are required",
      });
    }

    // Validate action
    if (!action || !["approve", "reject"].includes(action)) {
      return res.status(400).json({
        message: "Action is required and must be either 'approve' or 'reject'",
      });
    }

    // Check if session exists
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    } // Check if mentor exists and is a mentor
    const mentor = await Teacher.findById(mentorId);
    if (!mentor || mentor.role !== "mentor") {
      return res
        .status(400)
        .json({ message: "Invalid mentor ID or not a mentor" });
    }

    // Check if the authenticated user is the same as mentorId or is an admin
    if (req.userId !== mentorId && req.role !== "admin") {
      return res.status(403).json({
        message:
          "You can only approve/reject resources as yourself or as an admin",
      });
    }

    // Find language and resource
    const languageIndex = session.resourcesByLanguage.findIndex(
      (r) => r.language === language
    );

    if (languageIndex === -1) {
      return res
        .status(404)
        .json({ message: `Language ${language} not found in session` });
    }

    const resourceIndex = session.resourcesByLanguage[
      languageIndex
    ].resources.findIndex((r) => r._id.toString() === resourceId);

    if (resourceIndex === -1) {
      return res.status(404).json({ message: "Resource not found in session" });
    }

    if (action === "approve") {
      // Approve resource
      session.resourcesByLanguage[languageIndex].resources[
        resourceIndex
      ].approved = true;
      session.resourcesByLanguage[languageIndex].resources[
        resourceIndex
      ].approvedBy = mentorId;
      session.resourcesByLanguage[languageIndex].resources[
        resourceIndex
      ].approvedAt = new Date();

      await session.save();

      res.status(200).json({
        message: "Resource approved successfully",
        session,
      });
    } else {
      // Reject resource - simply remove it from the array
      session.resourcesByLanguage[languageIndex].resources.splice(
        resourceIndex,
        1
      );

      // If there are no more resources for this language, remove the language entry
      if (session.resourcesByLanguage[languageIndex].resources.length === 0) {
        session.resourcesByLanguage.splice(languageIndex, 1);
      }

      await session.save();

      res.status(200).json({
        message: "Resource rejected and removed successfully",
        session,
      });
    }
  } catch (error) {
    console.error(`Error processing resource: ${error.message}`);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get session completion statistics
const getSessionStats = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({ message: "Invalid session ID format" });
    }

    // Check if session exists
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Get completion statistics
    const totalUsers = await User.countDocuments({
      role: { $in: ["champion", "saathi"] },
    });

    const completedCount = await Progress.countDocuments({
      sessionId,
      completed: true,
    });

    const stats = {
      sessionTitle: session.title,
      sessionId: session._id,
      totalUsers,
      completedCount,
      completionPercentage:
        totalUsers > 0 ? (completedCount / totalUsers) * 100 : 0,
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error(`Error getting session statistics: ${error.message}`);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create a new test
const createTest = async (req, res) => {
  try {
    // Check for authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Authentication required. Bearer token missing." });
    }

    // Check if user is authenticated
    if (!req.userId) {
      return res
        .status(401)
        .json({ message: "Authentication required. User ID not found." });
    }

    const { courseId, title, type, language } = req.body;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID format" });
    }

    // Validate required fields
    if (!title || !type || !language) {
      return res
        .status(400)
        .json({ message: "Title, type, and language are required" });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Validate test type
    if (!["pre", "post"].includes(type)) {
      return res
        .status(400)
        .json({ message: "Test type must be 'pre' or 'post'" });
    }

    // Check if a test with this course, type, and language already exists
    const existingTest = await Test.findOne({ courseId, type, language });
    if (existingTest) {
      return res.status(400).json({
        message: `A ${type} test for this course in ${language} language already exists`,
      });
    }

    // Create test
    const newTest = new Test({
      courseId,
      title,
      type,
      language,
      questionIds: [],
    });

    const savedTest = await newTest.save();

    res.status(201).json({
      message: "Test created successfully",
      test: savedTest,
    });
  } catch (error) {
    console.error(`Error creating test: ${error.message}`);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all tests for a course
const getTestsByCourseId = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { language } = req.query;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID format" });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Build query
    const query = { courseId };
    if (language) {
      query.language = language;
    }

    const tests = await Test.find(query);

    res.status(200).json(tests);
  } catch (error) {
    console.error(`Error getting tests: ${error.message}`);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get test by ID
const getTestById = async (req, res) => {
  try {
    const { testId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(testId)) {
      return res.status(400).json({ message: "Invalid test ID format" });
    }

    const test = await Test.findById(testId).populate("questionIds");

    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    res.status(200).json(test);
  } catch (error) {
    console.error(`Error getting test: ${error.message}`);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create MCQ question
const createMCQQuestion = async (req, res) => {
  try {
    // Check for authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Authentication required. Bearer token missing." });
    }

    // Check if user is authenticated
    if (!req.userId) {
      return res
        .status(401)
        .json({ message: "Authentication required. User ID not found." });
    }

    const { questionText, options, correctAnswer, courseId } = req.body;

    if (!questionText || !options || !correctAnswer) {
      return res.status(400).json({
        message: "Question text, options, and correct answer are required",
      });
    }

    if (!Array.isArray(options) || options.length < 2) {
      return res
        .status(400)
        .json({ message: "At least 2 options are required" });
    }

    if (!options.includes(correctAnswer)) {
      return res
        .status(400)
        .json({ message: "Correct answer must be one of the options" });
    }

    // Validate courseId if provided
    if (courseId && !mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID format" });
    }

    const newQuestion = new MCQQuestion({
      questionText,
      options,
      correctAnswer,
      courseId: courseId || null,
    });

    const savedQuestion = await newQuestion.save();

    res.status(201).json({
      message: "Question created successfully",
      question: savedQuestion,
    });
  } catch (error) {
    console.error(`Error creating question: ${error.message}`);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Add question to test
const addQuestionToTest = async (req, res) => {
  try {
    // Check for authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Authentication required. Bearer token missing." });
    }

    // Check if user is authenticated
    if (!req.userId) {
      return res
        .status(401)
        .json({ message: "Authentication required. User ID not found." });
    }

    const { testId, questionId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(testId)) {
      return res.status(400).json({ message: "Invalid test ID format" });
    }

    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      return res.status(400).json({ message: "Invalid question ID format" });
    }

    // Check if test exists
    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    // Check if question exists
    const question = await MCQQuestion.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Check if question already in test
    if (test.questionIds.includes(questionId)) {
      return res
        .status(400)
        .json({ message: "Question already added to this test" });
    }

    // Add question to test
    test.questionIds.push(questionId);
    await test.save();

    res.status(200).json({
      message: "Question added to test successfully",
      test,
    });
  } catch (error) {
    console.error(`Error adding question to test: ${error.message}`);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Remove question from test
const removeQuestionFromTest = async (req, res) => {
  try {
    // Check for authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Authentication required. Bearer token missing." });
    }

    // Check if user is authenticated
    if (!req.userId) {
      return res
        .status(401)
        .json({ message: "Authentication required. User ID not found." });
    }

    const { testId, questionId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(testId)) {
      return res.status(400).json({ message: "Invalid test ID format" });
    }

    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      return res.status(400).json({ message: "Invalid question ID format" });
    }

    // Check if test exists
    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    // Check if question exists in test
    const questionIndex = test.questionIds.indexOf(questionId);
    if (questionIndex === -1) {
      return res
        .status(400)
        .json({ message: "Question not found in this test" });
    }

    // Remove question from test
    test.questionIds.splice(questionIndex, 1);
    await test.save();

    res.status(200).json({
      message: "Question removed from test successfully",
      test,
    });
  } catch (error) {
    console.error(`Error removing question from test: ${error.message}`);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all MCQ questions
const getAllMCQQuestions = async (req, res) => {
  try {
    const { courseId } = req.query;

    const query = {};

    if (courseId) {
      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(400).json({ message: "Invalid course ID format" });
      }
      query.courseId = courseId;
    }

    const questions = await MCQQuestion.find(query);

    res.status(200).json(questions);
  } catch (error) {
    console.error(`Error getting questions: ${error.message}`);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Remove a resource from a session
const removeResource = async (req, res) => {
  try {
    // Check for authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Authentication required. Bearer token missing." });
    }

    // Check if user is authenticated
    if (!req.userId) {
      return res
        .status(401)
        .json({ message: "Authentication required. User ID not found." });
    }

    const { sessionId } = req.params;
    const { language, resourceId, teacherId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({ message: "Invalid session ID format" });
    }

    // Validate required fields
    if (!language || !resourceId || !teacherId) {
      return res.status(400).json({
        message: "Language, resourceId, and teacherId are required",
      });
    }

    // Check if session exists
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Check if teacher exists
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res
        .status(400)
        .json({ message: `Teacher with ID ${teacherId} not found` });
    }

    // Check if the authenticated user is the same as teacherId or is an admin
    if (req.userId !== teacherId && req.role !== "admin") {
      return res.status(403).json({
        message: "You can only remove resources as yourself or as an admin",
      });
    }

    // Find language and resource
    const languageIndex = session.resourcesByLanguage.findIndex(
      (r) => r.language === language
    );

    if (languageIndex === -1) {
      return res
        .status(404)
        .json({ message: `Language ${language} not found in session` });
    }

    const resourceIndex = session.resourcesByLanguage[
      languageIndex
    ].resources.findIndex((r) => r._id.toString() === resourceId);

    if (resourceIndex === -1) {
      return res.status(404).json({ message: "Resource not found in session" });
    }

    // Check if the teacher has permission to remove the resource
    // Only the teacher who uploaded the resource or an admin can remove it
    const resource =
      session.resourcesByLanguage[languageIndex].resources[resourceIndex];

    if (
      resource.uploadedBy.toString() !== teacherId &&
      teacher.role !== "admin"
    ) {
      return res.status(403).json({
        message: "You don't have permission to remove this resource",
      });
    }

    // Remove the resource
    session.resourcesByLanguage[languageIndex].resources.splice(
      resourceIndex,
      1
    );

    // If there are no more resources for this language, remove the language entry
    if (session.resourcesByLanguage[languageIndex].resources.length === 0) {
      session.resourcesByLanguage.splice(languageIndex, 1);
    }

    await session.save();

    res.status(200).json({
      message: "Resource removed successfully",
      session,
    });
  } catch (error) {
    console.error(`Error removing resource: ${error.message}`);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  createSession,
  getSessionsByCourseId,
  getSessionById,
  updateSession,
  addResource,
  approveResource,
  getSessionStats,
  createTest,
  getTestsByCourseId,
  getTestById,
  createMCQQuestion,
  addQuestionToTest,
  removeQuestionFromTest,
  getAllMCQQuestions,
  removeResource,
};
