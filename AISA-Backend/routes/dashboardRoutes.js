import express from 'express';
import { getDashboardStats } from '../controllers/leadController.js';
import { verifyToken } from '../middleware/authorization.js';
const router = express.Router();

// Get real-time dashboard statistics for builders
router.get('/stats', verifyToken, getDashboardStats);

export default router;
