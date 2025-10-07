import { Request, Response } from "express";
import { GOALS } from "../utils/goals";
import UserGoal from "../model/Goal";
import { AuthRequest } from "../middlewares/authMiddleware";

export const getGoalsCatalog = async (req: Request, res: Response) => {
    res.json(GOALS);
};

// Add goal for a user
export const addGoal = async (req: AuthRequest, res: Response) => {
    try {
        const { goalKey } = req.body;
        const userId = req.user?.id;

        const goalExists = GOALS.find((g) => g.id === goalKey);
        if (!goalExists) {
            return res.status(400).json({ error: "Invalid goalKey" });
        }

        const already = await UserGoal.findOne({ userId, goalKey });
        if (already) {
            return res.status(400).json({ error: "Goal already selected" });
        }

        const newGoal = new UserGoal({ userId, goalKey });
        await newGoal.save();

        res.status(201).json(newGoal);
    } catch (err) {
        res.status(500).json({ error: "Failed to add goal" });
    }
};

// Get user’s goals
export const getUserGoals = async (req: AuthRequest, res: Response) => {
    try {
        const { id: userId } = req.params;

        if (req.user?.id !== userId) {
            return res.status(403).json({ error: "Forbidden" });
        }

        const userGoals = await UserGoal.find({ userId });

        const enriched = userGoals.map((ug) => {
            const goalDetails = GOALS.find((g) => g.id === ug.goalKey);
            if (!goalDetails) {
                return null;
            }
            return {
                ...goalDetails,
                selectedAt: ug.createdAt
            };
        }).filter(Boolean);

        res.json(enriched);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch user goals" });
    }
};

// Remove goal from user
export const removeGoal = async (req: AuthRequest, res: Response) => {
    try {
        const { id: userId, goalKey } = req.params;
        if (req.user?.id !== userId) {
            return res.status(403).json({ error: "Forbidden" });
        }

        const deleted = await UserGoal.findOneAndDelete({ userId, goalKey });

        if (!deleted) {
            return res.status(404).json({ error: "Goal not found" });
        }
        res.json({ message: "Goal removed" });
    } catch (err) {
        res.status(500).json({ error: "Failed to remove goal" });
    }
};
