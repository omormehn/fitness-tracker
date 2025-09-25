import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { RefreshToken } from '../model/RefreshToken';

import mongoose from 'mongoose';

const ACCESS_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET! || 'access_secret';
const REFRESH_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET || 'refresh_secret';
const ACCESS_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES! || '15m';
const REFRESH_EXPIRES_DAYS = Number(process.env.REFRESH_TOKEN_EXPIRES_DAYS || 30);

// Create JWT access token
export const createAccessToken = (userId: mongoose.Types.ObjectId | string | any): string => {
    return jwt.sign(
        { sub: userId.toString() },
        ACCESS_SECRET,
        { expiresIn: ACCESS_EXPIRES } as jwt.SignOptions
    );
};

// Create refresh token: generate random string, store hash in DB
export const createRefreshToken = async (userId: mongoose.Types.ObjectId | string | any) => {
    const tokenPlain = crypto.randomBytes(64).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(tokenPlain).digest('hex');
    const expiresAt = new Date(Date.now() + REFRESH_EXPIRES_DAYS * 24 * 60 * 60 * 1000);

    const rt = new RefreshToken({
        user: userId,
        tokenHash,
        expiresAt,
    });
    await rt.save();

    return tokenPlain;
};

// Verify access token
export const verifyAccessToken = (token: string) => {
    try {
        return jwt.verify(token, ACCESS_SECRET) as { sub: string; iat: number; exp: number };
    } catch (err) {
        return null;
    }
};

// Utility to find and validate refresh token by plain text
export const findRefreshTokenDocument = async (tokenPlain: string) => {
    const tokenHash = crypto.createHash('sha256').update(tokenPlain).digest('hex');
    const tokenDoc = await RefreshToken.findOne({ tokenHash }).populate('user');
    if (!tokenDoc) return null;
    if (tokenDoc.revoked) return null;
    if (tokenDoc.expiresAt < new Date()) return null;
    return tokenDoc;
};

// Revoke a refresh token doc and optionally mark replacedByToken
export const revokeRefreshToken = async (tokenDoc: any, replacedByToken?: string | null) => {
    tokenDoc.revoked = true;
    tokenDoc.replacedByToken = replacedByToken || null;
    await tokenDoc.save();
};
