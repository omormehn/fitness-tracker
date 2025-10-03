import mongoose, { Document, Schema } from "mongoose";

export interface IActivitySummary extends Document {
  userId: mongoose.Types.ObjectId;
  steps: number;
  water: number;           
  calories: number;        
  workoutMinutes: number;
  date: Date;
  createdAt: Date;
}

const activitySummarySchema = new Schema<IActivitySummary>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  steps: { type: Number, default: 0 },
  water: { type: Number, default: 0 },
  calories: { type: Number, default: 0 },
  workoutMinutes: { type: Number, default: 0 },
  date: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});
 
activitySummarySchema.index({ userId: 1, date: 1 }, { unique: true });

const ActivitySummary = mongoose.model<IActivitySummary>(
  "ActivitySummary",
  activitySummarySchema
);

export default ActivitySummary;
