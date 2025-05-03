import { Router } from 'express';
import { adminLogin, customerLogin, changeUserPassword } from '../controllers/auth.controllers';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Public routes
router.post('/admin-login', adminLogin);
router.post('/customer-login', customerLogin);
router.get('/customer-login', customerLogin);

// Protected routes
router.patch('/change-password', authenticate, changeUserPassword);

export default router;