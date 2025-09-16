import { Router } from 'express';
import { register, login, refreshToken, logout, registerValidators, loginValidators } from '../controllers/authController';

const router = Router();

router.post('/register', registerValidators, register);
router.post('/login', loginValidators, login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

export default router;
