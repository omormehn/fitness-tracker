import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware';
import { saveTarget, getTodayTarget, getTargetHistory, upsertActivitySummary, getWeeklySummary, getDailySummary } from '../controllers/healthController';

const router = Router();

router.post("/add-target", requireAuth, saveTarget);
router.get("/today-target", requireAuth, getTodayTarget);
router.get("/target-history", requireAuth, getTargetHistory);
router.post("/add-activity", requireAuth, upsertActivitySummary);
router.get("/daily-activity", requireAuth, getDailySummary);
router.get("/weekly-activity", requireAuth, getWeeklySummary);

export default router;
