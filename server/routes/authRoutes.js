import express from 'express';
import { registerUser, registerTeacher, login, logout } from '../controllers/authController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', login);
router.post('/logout', authenticate, logout);



// Protected routes - Admin only
router.post('/register-teacher', authenticate, authorize(['admin']), registerTeacher);

export default router;
