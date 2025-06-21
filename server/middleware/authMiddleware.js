import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Admin from "../models/Admin.js";
import Teacher from "../models/Teacher.js";

const authenticate = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token found" });
  }
  try {
    const jwtSecret =
      process.env.JWT_SECRET || "fallbackSecretKey123DoNotUseInProduction";
    const decoded = jwt.verify(token, jwtSecret);
    const { userId, role } = decoded;

    let currentUser = null;

    if (role === "admin") {
      currentUser = await Admin.findById(userId).select("-password");
    } else if (role === "teacher") {
      currentUser = await Teacher.findById(userId).select("-password");
    } else if (role === "user") {
      currentUser = await User.findById(userId).select("-password");
    }

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach user and role to request object
    req.user = currentUser;
    req.role = role; // 'admin', 'teacher', 'user'
    req.userId = userId;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.role)) {
      return res.status(403).json({ message: "Forbidden: Insufficient role" });
    }
    next();
  };
};

export { authenticate, authorize };
