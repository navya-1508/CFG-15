import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Admin from "../models/Admin.js";
import Teacher from "../models/Teacher.js";

const authenticate = async (req, res, next) => {
  // Accept tokens from both cookies and Authorization headers for ALL endpoints
  // This provides flexibility for frontend development and API clients

  const adminEndpoints = ["/promotion-requests", "/process-promotion"];

  // Check if this is an admin endpoint (for specialized handling later)
  const isAdminEndpoint = adminEndpoints.some((path) =>
    req.path.includes(path)
  );

  // Get token from either cookie or Authorization header
  let token = null;

  // Check for token in cookie first
  if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
    console.log("Auth: Found token in cookie");
  }

  // Check for Bearer token in Authorization header (this will override cookie if both exist)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    const bearerToken = req.headers.authorization.split(" ")[1];
    if (bearerToken) {
      token = bearerToken;
      console.log("Auth: Found token in Authorization header");
    }
  }

  // If no token found in either place, return 401
  if (!token) {
    return res.status(401).json({
      message:
        "Unauthorized: No authentication token found in cookie or Authorization header",
    });
  }
  try {
    const jwtSecret =
      process.env.JWT_SECRET || "fallbackSecretKey123DoNotUseInProduction";
    console.log(`Auth: Attempting to verify token for path: ${req.path}`);

    // Determine token source for logging
    const tokenSource =
      req.cookies && req.cookies.jwt && token === req.cookies.jwt
        ? "Cookie"
        : "Bearer";
    console.log(`Auth: Token source: ${tokenSource}`);

    const decoded = jwt.verify(token, jwtSecret);
    console.log(`Auth: Token decoded successfully:`, decoded);
    const { userId, role } = decoded;

    let currentUser = null;
    console.log(`Auth: Processing token with userId: ${userId}, role: ${role}`); // We've already defined isAdminEndpoint earlier, so we can use it directly
    if (isAdminEndpoint && role !== "admin") {
      console.log(
        `Auth: Rejecting access to admin endpoint ${req.path} for non-admin role: ${role}`
      );
      console.log(
        `Auth: Token source: ${tokenSource} is invalid for this admin endpoint`
      );
      return res.status(403).json({
        message: "Forbidden: This endpoint requires admin privileges",
        requiredRole: "admin",
        yourRole: role,
      });
    }

    if (isAdminEndpoint) {
      console.log(
        `Auth: Admin endpoint ${req.path} accessed with valid admin role`
      );
      console.log(
        `Auth: Token successfully validated from ${tokenSource} for admin endpoint`
      );
    }

    if (role === "admin") {
      currentUser = await Admin.findById(userId).select("-password");
      // Double check that we found an admin user
      if (!currentUser) {
        console.log(
          `Auth: Admin user with ID ${userId} not found in Admin collection`
        );
        return res.status(401).json({
          message: "Unauthorized: Invalid admin credentials",
        });
      }
    } else if (role === "teacher" || role === "trainer" || role === "mentor") {
      currentUser = await Teacher.findById(userId).select("-password");
    } else if (role === "user" || role === "champion" || role === "saathi") {
      // Check if the role is one of the user sub-roles
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
    console.error(`Auth Error: ${err.message} for path: ${req.path}`, err);
    console.error(
      `Auth Error: Token verification failed for token from ${
        req.cookies && req.cookies.jwt ? "cookie and/or" : ""
      } ${req.headers.authorization ? "bearer token" : "no bearer token"}`
    );
    return res
      .status(401)
      .json({ message: "Invalid or expired token", error: err.message });
  }
};

const authorize = (roles = []) => {
  return (req, res, next) => {
    console.log(
      `Authorization check: User role: ${
        req.role
      }, Required roles: ${roles.join(", ")}`
    );

    if (!req.role) {
      console.log("Authorization failed: No role found in request");
      return res.status(403).json({
        message: "Forbidden: No role information found",
        requiredRoles: roles,
      });
    }

    if (!roles.includes(req.role)) {
      console.log(
        `Authorization failed: User role ${
          req.role
        } not in allowed roles: ${roles.join(", ")}`
      );
      return res.status(403).json({
        message: "Forbidden: You don't have permission to access this resource",
        yourRole: req.role,
        requiredRoles: roles,
      });
    }

    console.log(`Authorization successful: User has role ${req.role}`);
    next();
  };
};

const protect = authenticate;

export { authenticate, authorize, protect };
