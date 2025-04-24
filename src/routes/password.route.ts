import { Router } from 'express';
import { forgotPassword, resetPasswordHandler } from '../controllers/passwordReset'

const router = Router();

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPasswordHandler);

export default router;      