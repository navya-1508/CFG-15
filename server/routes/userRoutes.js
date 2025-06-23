import express from "express";
import {
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
  checkCertificateStatus,
  getPromotionRequests,
  processPromotionRequest,
} from "../controllers/userController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply auth middleware to all routes
// This ensures every route in this file requires authentication
console.log("User Routes: Applying protect middleware to all routes");


// User profile routes (available to all authenticated users)
router.get("/profile",protect, getProfile);
router.put("/updateprofile",protect, updateProfile);

// Dashboard route (content based on user role)
router.get("/dashboard",protect, getDashboard);

// Course routes (only accessible by champions and saathis)
router.get("/courses",protect, authorize(["champion", "saathi"]), getCourses);
router.get("/courses/:id", protect, authorize(["champion", "saathi"]), getCourseById);

// Session routes (only accessible by champions and saathis)
router.get("/sessions/:id",protect, authorize(["champion", "saathi"]), getSessionById);
router.post(
  "/sessions/:id/complete",protect,
  authorize(["champion", "saathi"]),
  completeSession
);

// Certificate routes (only for champions and saathis)
router.get(
  "/certificate/:courseId",
  protect,
  authorize(["champion", "saathi"]),
  getCertificate
);

router.get(
  "/certificate-status/:courseId",
  protect,
  authorize(["champion", "saathi"]),
  checkCertificateStatus
);

// Grievance route (for all users)
router.post("/grievance", protect, submitGrievance);

// Promotion request (for champions only)
router.post(
  "/request-saathi-promotion",
  protect,
  authorize(["champion"]),
  requestSaathiPromotion
);

// Test score submission route (for champions and saathis)
router.post("/test-score",protect, authorize(["champion", "saathi"]), submitTestScore);

// Badge routes (for champions and saathis)
router.get("/badges",protect, authorize(["champion", "saathi"]), getUserBadges);

// Admin routes for promotion management
router.get("/promotion-requests",protect, authorize(["admin"]), getPromotionRequests);
router.post(
  "/process-promotion",
  protect,
  authorize(["admin"]),
  processPromotionRequest
);

export default router;
