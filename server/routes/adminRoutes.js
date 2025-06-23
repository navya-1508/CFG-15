import express from 'express';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { 
  registerTeacher, 
  login, 
  logout 
} from '../controllers/authController.js';

import {
  getProfile,
  updateProfile,
  getDashboard,
  getCourses,
  getCourseById,
  getSessionById,
  getPromotionRequests,
  processPromotionRequest
} from '../controllers/userController.js';

import {
  createCourse,
  getAllCourses,
  getCourseById as getCourseByIdFromCourse,
  updateCourse,
  createSession,
  getSessionsByCourseId,
  getSessionById as getSessionByIdFromCourse,
  updateSession,
  addResource,
  removeResource,
  approveResource,
  getSessionStats
} from '../controllers/courseController.js';

import upload from '../utils/fileUpload.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);
// Ensure only admins can access these routes
router.use(authorize(['admin']));

// Auth related routes
router.post('/register-teacher', registerTeacher);
router.post('/login', login); // For admin login specifically
router.post('/logout', logout);

// User management routes
router.get('/profile', getProfile);
router.put('/updateprofile', updateProfile);
router.get('/dashboard', getDashboard);
router.get('/courses', getCourses);
router.get('/courses/:id', getCourseById);
router.get('/sessions/:id', getSessionById);
router.get('/promotion-requests', getPromotionRequests);
router.post('/process-promotion', processPromotionRequest);

// Course management routes
router.post('/courses/create', createCourse);
router.get('/courses', getAllCourses);
router.get('/courses/:courseId', getCourseByIdFromCourse);
router.put('/courses/:courseId', updateCourse);
router.post('/courses/session/create', createSession);
router.get('/courses/:courseId/sessions', getSessionsByCourseId);
router.get('/courses/session/:sessionId', getSessionByIdFromCourse);
router.put('/courses/session/:sessionId', updateSession);

// Resource management
router.post('/courses/session/:sessionId/resource', upload.single('file'), addResource);
router.delete('/courses/session/:sessionId/resource', removeResource);
router.post('/courses/session/:sessionId/approve', approveResource);
router.get('/courses/session/:sessionId/stats', getSessionStats);

export default router;
