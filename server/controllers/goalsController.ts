import { Request, Response } from "express";
import { GOALS } from "../utils/goals";
import UserGoal from "../model/Goal";

export const getGoalsCatalog = async (req: Request, res: Response) => {
  res.json(GOALS);
};

// Add goal for a user
export const addGoal = async (req: Request, res: Response) => {
    try {
        const { userId, goalKey } = req.body;

        // validate that goalKey exists in catalog
        const goalExists = GOALS.find((g) => g.id === goalKey);
        if (!goalExists) {
            return res.status(400).json({ error: "Invalid goalKey" });
        }

        // check if already selected
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
export const getUserGoals = async (req: Request, res: Response) => {
    try {
        const { id: userId } = req.params;

        const userGoals = await UserGoal.find({ userId });

        const enriched = userGoals.map((ug: any) => {
            const goalDetails = GOALS.find((g: any) => g.id === ug.goalKey);
            return {
                ...goalDetails,
                selectedAt: ug.createdAt
            };
        });

        res.json(enriched);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch user goals" });
    }
};

// Remove goal from user
export const removeGoal = async (req: Request, res: Response) => {
    try {
        const { id: userId, goalKey } = req.params;

        await UserGoal.findOneAndDelete({ userId, goalKey });

        res.json({ message: "Goal removed" });
    } catch (err) {
        res.status(500).json({ error: "Failed to remove goal" });
    }
};
