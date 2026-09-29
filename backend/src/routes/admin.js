import express from 'express';
import { adminAuth } from '../middleware/adminAuth.js';
import { getAdminStats, getRecentActivity } from '../services/adminService.js';

const router = express.Router();

// Protect all admin endpoints
router.use(adminAuth);

// GET /api/admin/stats
router.get('/stats', async (_req, res, next) => {
  try {
    const stats = await getAdminStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/activity?limit=20
router.get('/activity', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 20;
    const activity = await getRecentActivity(limit);
    res.json(activity);
  } catch (err) {
    next(err);
  }
});

export default router;
