import { Router } from "express";
import { getGoalsCatalog, addGoal, getUserGoals, removeGoal } from "../controllers/goalsController";
import { requireAuth } from "../middlewares/authMiddleware";


const router = Router();

router.get("/", getGoalsCatalog);
router.post("/add-goal", requireAuth, addGoal);
router.get("/users/:id/goals", requireAuth, getUserGoals);
router.delete("/users/:id/goals/:goalKey", requireAuth, removeGoal);

export default router;
