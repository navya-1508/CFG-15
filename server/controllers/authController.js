import User from "../models/User.js";
import Teacher from "../models/Teacher.js";
import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import createToken from "../utils/createToken.js";

const registerUser = async (req, res) => {
  const { username, email, password, role = "user" } = req.body;

  console.log(
    `Registration attempt with username: ${username}, email: ${email}, role: ${role}`
  );

  try {
    // Validate required fields
    if (!username || !email || !password) {
      console.log("Registration failed: Missing required fields");
      return res.status(400).json({
        message: "Registration failed",
        error: "Username, email, and password are required",
      });
    }

    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      console.log(
        `User already exists with username: ${username} or email: ${email}`
      );
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role, // 'user', 'champion', or 'saathi'
    });
    const savedUser = await newUser.save();

    // Create JWT token and set cookie
    const token = createToken(res, savedUser._id, savedUser.role);

    // Return response
    res.status(201).json({
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        role: savedUser.role,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const registerTeacher = async (req, res) => {
  const { username, email, password, role, language, bio } = req.body;

  try {
    // Validate role
    if (!["trainer", "mentor"].includes(role)) {
      return res.status(400).json({ message: "Invalid teacher role" });
    }

    // Check if username or email already exists
    const existingTeacher = await Teacher.findOne({
      $or: [{ username }, { email }],
    });
    if (existingTeacher) {
      return res
        .status(400)
        .json({ message: "Username or email already in use" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save teacher
    const newTeacher = new Teacher({
      username,
      email,
      password: hashedPassword,
      role, // 'trainer' or 'mentor'
      language, // 'english', 'hindi', etc.
      bio, // optional
    });
    const savedTeacher = await newTeacher.save();

    // Create token and set cookie
    const token = createToken(res, savedTeacher._id, "teacher"); // role in token = 'teacher'

    // Return response
    res.status(201).json({
      _id: savedTeacher._id,
      username: savedTeacher.username,
      email: savedTeacher.email,
      role: savedTeacher.role,
      language: savedTeacher.language,
      bio: savedTeacher.bio,
    });
  } catch (error) {
    console.error("Teacher registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//  const adminLogin = async (req, res) => {
//   const { username, password } = req.body;
//   console.log(`Admin login attempt for username: ${username}`); 
  
//   try {
//     if (!username || !password) {
//       return res.status(400).json({ message: "Username and password are required" });
//     }

//     const admin = await Admin.findOne({ username });

//     if (!admin) {
//       console.log(`No admin found with username: ${username}`);
//       return res.status(401).json({ message: "Invalid username or password" });
//     }

//     const isMatch = await bcrypt.compare(password, admin.password);
//     if (!isMatch) {
//       console.log(`Incorrect password for admin: ${username}`);
//       return res.status(401).json({ message: "Invalid username or password" });
//     }

//     return res.status(200).json({
//       admin: {
//         _id: admin._id,
//         username: admin.username,
//         email: admin.email,
//         role:  "admin",
//       },
//       message: "Login successful"
//     });

//   } catch (error) {
//     console.error(`Error in admin login: ${error.message}`);
//     return res.status(500).json({ message: "Server error" });
//   }
// };
      

const login = async (req, res) => {
  try {
    const { username, password, role } = req.body; // role: 'user' | 'champion' | 'saathi' | 'trainer' | 'mentor' | 'admin'

    console.log(`Login attempt for username/email: ${username}, role: ${role}`);

    let user;
    let authSource;

    // Support both username and email login - try to match either field
    const query = { $or: [{ username }, { email: username }] };

    // Normalize to main model
    if (["user", "champion", "saathi"].includes(role)) {
      user = await User.findOne(query);
      authSource = "user";
    } else if (["trainer", "mentor"].includes(role)) {
      user = await Teacher.findOne(query);
      authSource = "teacher";
    } else if (role === "admin") {
      user = await Admin.findOne(query);
      authSource = "admin";
    } else {
      console.log(`Invalid role: ${role}`);
      return res.status(400).json({ message: "Invalid role" });
    }

    if (!user) {
      console.log(`No user found for: ${username} with role: ${role}`);
      return res
        .status(401)
        .json({ message: "Invalid username/email or password" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    } // Use the specific sub-role if available
    const actualRole = user.role || "admin"; // Admin has no internal role
    // Create token and set cookie - pass res as the first parameter
    console.log(
      `Login: Creating token for user ID: ${user._id}, role: ${actualRole}`
    );
    const token = createToken(res, user._id, actualRole); // Store sub-role in token

    // Response
    let responseData = {
      _id: user._id,
      username: user.username,
      authSource, // 'user', 'teacher', or 'admin'
      role: actualRole, // 'champion', 'mentor', etc.
      token, // Include token in response for Bearer token auth
    };

    if (authSource === "user") {
      responseData = {
        ...responseData,
        email: user.email,
        language: user.language,
        profilePicture: user.profilePicture,
      };
    }

    if (authSource === "teacher") {
      responseData = {
        ...responseData,
        email: user.email,
        language: user.language,
        bio: user.bio,
      };
    }

    res.status(200).json(responseData);
  } catch (error) {
    console.error(`Error in login: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

const logout = (req, res) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(`Error in logout: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

// Export all controller functions
export { registerUser, registerTeacher, login, logout  };
