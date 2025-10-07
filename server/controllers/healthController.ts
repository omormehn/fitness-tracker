import { Request, Response } from "express";
import Target from "../model/Target";
import { AuthRequest } from "../middlewares/authMiddleware";
import ActivitySummary from "../model/Activity";


// Create or update today's target
export const saveTarget = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id;
        const { steps, water, calories, workoutMinutes } = req.body;

        const today = new Date();
        today.setHours(0, 0, 0, 0); // start of today

        // next midnight (end of day)
        const expiresAt = new Date(today);
        expiresAt.setDate(expiresAt.getDate() + 1); // tomorrow 00:00

        const updates: any = {};
        if (steps) updates.steps = steps;
        if (water) updates.water = water;
        if (calories) updates.calories = calories;
        if (workoutMinutes) updates.workoutMinutes = workoutMinutes;

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "Empty records" });
        }

        updates.effectiveDate = today;
        updates.expiresAt = expiresAt;

        const target = await Target.findOneAndUpdate(
            { userId, effectiveDate: today },
            { $set: updates },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.json(target);
    } catch (err) {
        console.error("error in upd trg", err);
        res.status(500).json({ message: "Failed to save target", error: err });
    }
};


// Get today's target
export const getTodayTarget = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const target = await Target.findOne({ userId, effectiveDate: today });
        res.json(target || {});
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch target", error: err });
    }
};

// Get history
export const getTargetHistory = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { from, to } = req.query;

        const filter: any = { userId };
        if (from && to) {
            filter.effectiveDate = { $gte: new Date(from as string), $lte: new Date(to as string) };
        }

        const targets = await Target.find(filter).sort({ effectiveDate: -1 });
        res.json(targets);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch history", error: err });
    }
};

// Add or update today's summary
export const upsertActivitySummary = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const { water, workoutMinutes } = req.body;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const existingSummary = await ActivitySummary.findOne({ userId, date: today });
        const w = water === undefined ? undefined : Number(water);
        const wm = workoutMinutes === undefined ? undefined : Number(workoutMinutes);
        if ((w !== undefined && (!Number.isFinite(w) || w < 0)) ||
            (wm !== undefined && (!Number.isFinite(wm) || wm < 0))) {
            return res.status(400).json({ message: "Invalid values; must be non-negative numbers" });
        }
        let updatedSummary: any;

        if (existingSummary) {
            updatedSummary = await ActivitySummary.findOneAndUpdate(
                { userId, date: today },
                {
                    $set: {
                        water: w !== undefined ? w + (existingSummary.water || 0) : existingSummary.water,
                        workoutMinutes:
                            wm !== undefined
                                ? wm + (existingSummary.workoutMinutes || 0)
                                : existingSummary.workoutMinutes,
                    },
                },
                { new: true }
            );
        } else {
            updatedSummary = await ActivitySummary.create({
                userId,
                date: today,
                water: w || 0,
                workoutMinutes: wm || 0,
            });
        }
        res.json(updatedSummary);
    } catch (err) {
        res.status(500).json({ message: "Failed to save activity summary", error: err });
    }
};

// Get summary for a specific day
export const getDailySummary = async (req: AuthRequest, res: Response) => {
    try {
        const { date } = req.query;
        const userId = req.user?.id

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!date) {
            return res.status(400).json({ message: "Date parameter required" });
        }

        const day = new Date(date as string);
        if (isNaN(day.getTime())) {
            return res.status(400).json({ message: "Invalid date format" });
        }
        day.setHours(0, 0, 0, 0);

        const summary = await ActivitySummary.findOne({ userId, date: day });
        res.json(summary || {});
    } catch (err) {
        console.error('error', err)
        res.status(500).json({ message: "Failed to fetch summary", error: err });
    }
};

// Get weekly summary (for charts)
export const getWeeklySummary = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 6);

        const summaries = await ActivitySummary.find({
            userId,
            date: { $gte: weekAgo, $lte: today },
        }).sort({ date: 1 });

        res.json(summaries);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch weekly summary", error: err });
    }
};