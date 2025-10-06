import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/token';
import User from '../model/User';

export interface AuthRequest extends Request {
    user?: any;
}

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    console.log('token', token)
    const payload = verifyAccessToken(token!);
    if (payload) {
        const user = await User.findById(payload.sub).select('-password');
        if (!user) return res.status(401).json({ message: 'User not found' });
        req.user = user;
        return next();
    }

    return res.status(401).json({
        message: 'Token expired',
        code: 'TOKEN_EXPIRED' 
    });
};
