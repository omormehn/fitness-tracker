import {Router} from "express";
import { getGoalsCatalog, addGoal, getUserGoals, removeGoal } from "../controllers/goalsController";


const router = Router();

router.get("/", getGoalsCatalog);          
router.post("/add-goal", addGoal);         
router.get("/users/:id/goals", getUserGoals);  
router.delete("/users/:id/goals/:goalKey", removeGoal);

export default router;
