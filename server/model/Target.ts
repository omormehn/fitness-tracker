import mongoose from "mongoose";

export interface ITarget extends Document {
    userId: mongoose.Types.ObjectId;
    steps?: number,
    water?: number,
    calories?: number,
    workoutMinutes?: number,
    effectiveDate: Date,
    createdAt: Date
}

const dailyTargetSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    steps: { type: Number, min: 0 },
    water: { type: Number, min: 0 },
    calories: { type: Number, min: 0 },
    workoutMinutes: { type: Number, min: 0 },
    effectiveDate: { type: Date, default: () => new Date(new Date().setHours(0, 0, 0, 0)) },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true }
});

dailyTargetSchema.index({ userId: 1, effectiveDate: 1 }, { unique: true });
dailyTargetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Target = mongoose.model<ITarget>('Target', dailyTargetSchema)
export default Target;