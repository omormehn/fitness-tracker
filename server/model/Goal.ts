import mongoose from "mongoose";

interface IGoals extends Document {
    userId: mongoose.Types.ObjectId;
    goalKey: string;
    createdAt: Date
}


const userGoalSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    goalKey: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});
userGoalSchema.index({ userId: 1, goalKey: 1 }, { unique: true });

const UserGoal = mongoose.model<IGoals>('Goals', userGoalSchema);
export default UserGoal;