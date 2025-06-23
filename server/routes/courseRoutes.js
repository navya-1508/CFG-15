import express from "express";
import { authenticate, authorize } from "../middleware/authMiddleware.js";
import upload from "../utils/fileUpload.js";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  createSession,
  getSessionsByCourseId,
  getSessionById,
  updateSession,
  addResource,
  removeResource,
  approveResource,
  getSessionStats,
  createTest,
  getTestsByCourseId,
  getTestById,
  createMCQQuestion,
  addQuestionToTest,
  removeQuestionFromTest,
  getAllMCQQuestions,
} from "../controllers/courseController.js";

const router = express.Router();

// Course routes
router.post("/create", authenticate, authorize(["admin"]), createCourse);
router.get(
  "/",
  getAllCourses
);
router.get(
  "/:courseId",
  authenticate,
  authorize(["admin", "mentor", "trainer", "champion", "saathi"]),
  getCourseById
);
router.put("/:courseId", authenticate, authorize(["admin"]), updateCourse);

// Session routes
router.post(
  "/session/create",
  authenticate,
  authorize(["admin"]),
  createSession
);
router.get(
  "/:courseId/sessions",
  getSessionsByCourseId
);
router.get(
  "/session/:sessionId",
  getSessionById
);
router.put(
  "/session/:sessionId",
  authenticate,
  authorize(["admin"]),
  updateSession
);

// Resource routes
router.post(
  "/session/:sessionId/resource",
  authenticate,
  authorize(["admin", "trainer"]),
  upload.single("file"), // 'file' is the name of the form field
  addResource
);
router.delete(
  "/session/:sessionId/resource",
  authenticate,
  authorize(["admin", "trainer"]),
  removeResource
);
router.post(
  "/session/:sessionId/approve",
  authenticate,
  authorize(["admin", "mentor"]),
  approveResource
);
router.get(
  "/session/:sessionId/stats",
  authenticate,
  authorize(["admin", "mentor", "trainer"]),
  getSessionStats
);

// Test routes
router.post(
  "/test/create",
  authenticate,
  authorize(["admin", "mentor"]),
  createTest
);
router.get(
  "/:courseId/tests",
  authenticate,
  authorize(["admin", "mentor", "trainer", "champion", "saathi"]),
  getTestsByCourseId
);
router.get(
  "/test/:testId",
  authenticate,
  authorize(["admin", "mentor", "trainer", "champion", "saathi"]),
  getTestById
);

// MCQ Question routes
router.post(
  "/question/create",
  authenticate,
  authorize(["admin", "mentor"]),
  createMCQQuestion
);
router.post(
  "/test/add-question",
  authenticate,
  authorize(["admin", "mentor"]),
  addQuestionToTest
);
router.post(
  "/test/remove-question",
  authenticate,
  authorize(["admin", "mentor"]),
  removeQuestionFromTest
);
router.get(
  "/questions",
  authenticate,
  authorize(["admin", "mentor"]),
  getAllMCQQuestions
);

export default router;
