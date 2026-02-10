import express from 'express';
import { getLeads, seedSampleData, createLead } from '../controllers/leadController.js';
import { verifyToken } from '../middleware/authorization.js';

const router = express.Router();

router.get('/', verifyToken, getLeads);
router.post('/', createLead);
router.post('/seed', seedSampleData);

export default router;
