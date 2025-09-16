import mongoose, { Schema, Document } from 'mongoose';

export interface IRefreshToken extends Document {
    user: mongoose.Types.ObjectId;
    tokenHash: string; 
    expiresAt: Date;
    createdAt: Date;
    revoked?: boolean;
    replacedByToken?: string | null;
}

const RefreshTokenSchema = new Schema<IRefreshToken>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tokenHash: { type: String, required: true, index: true },
    expiresAt: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
    revoked: { type: Boolean, default: false },
    replacedByToken: { type: String, default: null },
});

// Optionally add TTL index (if you want mongo to auto-remove expired tokens)
// RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RefreshToken = mongoose.model<IRefreshToken>('RefreshToken', RefreshTokenSchema);
