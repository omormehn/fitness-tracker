// src/controllers/authController.ts
import { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import User from '../model/User';
import { createAccessToken, createRefreshToken, findRefreshTokenDocument, revokeRefreshToken } from '../utils/token';
import { validateRequest } from '../middlewares/validateRequest';
import { OAuth2Client } from "google-auth-library";
import crypto from 'crypto';



const clientId = process.env.CLIENT_ID || ''
const client = new OAuth2Client(clientId);



export const register = async (req: Request, res: Response) => {
    const { fullName, email, password, phone } = req.body;
    const emailNorm = (email || '').toLowerCase().trim();
    const existing = await User.findOne({ email: emailNorm });
    if (existing) return res.status(409).json({ message: 'Email already in use' });


    const user = new User({ fullName: fullName?.trim(), email: emailNorm, password, phone });


    try {
        await user.save();
        const accessToken = createAccessToken(user._id);
        const refreshToken = await createRefreshToken(user._id);
        res.status(201).json({
            user: { id: user._id, fullName: user.fullName, email: user.email },
            accessToken,
            refreshToken,
        });
    } catch (error) {
        console.log('error in reg', error)
    }



};



export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });


    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const accessToken = createAccessToken(user._id);
    const refreshToken = await createRefreshToken(user._id);

    res.json({
        user: { id: user._id, fullName: user.fullName, email: user.email },
        accessToken,
        refreshToken,
    });
};

export const refreshToken = async (req: Request, res: Response) => {
    const { refreshToken: tokenPlain } = req.body;
    if (!tokenPlain) return res.status(400).json({ message: 'Refresh token required' });

    const tokenDoc = await findRefreshTokenDocument(tokenPlain);
    if (!tokenDoc) return res.status(401).json({ message: 'Invalid or expired refresh token' });

    // rotate: issue new token, then revoke old and link to the new token
    const newRefreshToken = await createRefreshToken(tokenDoc.user._id);
    await revokeRefreshToken(tokenDoc, newRefreshToken); // mark old as revoked
    const newAccessToken = createAccessToken(tokenDoc.user._id);

    res.json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
    });
};

export const logout = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'Refresh token required' });

    const tokenDoc = await findRefreshTokenDocument(refreshToken);
    if (tokenDoc) {
        await revokeRefreshToken(tokenDoc);
    }
    res.json({ message: 'Logged out' });
};
export const verifyGoogleToken = async (req: Request, res: Response) => {
    const { token } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: clientId,
        });

        const payload = ticket.getPayload();
        if (!payload) {
            return res.status(401).json({ error: "Invalid Google token" });
        }
        console.log('payload', payload)
        const { email, name, } = payload;
        const emailNorm = (email || "").toLowerCase().trim();

        let user = await User.findOne({ email: emailNorm });
        if (!user) {
            user = new User({
                fullName: name,
                email: emailNorm,
                password: crypto.randomBytes(32).toString('hex') // dummy
            });
            await user.save();
        }

        const accessToken = createAccessToken(user._id);
        const refreshToken = await createRefreshToken(user._id);

        res.json({
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
            },
            accessToken,
            refreshToken,
        });
    } catch (error) {
        console.error("Google login error:", error);
        res.status(401).json({ error: "Invalid Google token" });
    }
}

