import { Router } from 'express';
import { register, login, refreshToken, logout, verifyGoogleToken, updateUser } from '../controllers/authController';
import { registerValidators, loginValidators } from '../middlewares/validateRequest';

const router = Router();

router.post('/register', registerValidators, register);
router.post('/login', loginValidators, login);
router.post('/update', updateUser);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);
router.post('/google', verifyGoogleToken);

export default router;
