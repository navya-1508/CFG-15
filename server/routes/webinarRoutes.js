// routes/webinarRoutes.js
import express from 'express';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { createWebinar, getAllWebinars } from '../controllers/webinarController.js';

const router = express.Router();

router.post('/create', authenticate, authorize(['admin', 'champion', 'mentor']), createWebinar);
router.get('/', authenticate, getAllWebinars);

export default router;
