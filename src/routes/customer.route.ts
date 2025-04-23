import { Router } from 'express';
import { createCustomerHandler } from '../controllers/customer.controllers';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Admin-only routes
router.post('/', authenticate, authorize(['admin', 'superAdmin']), createCustomerHandler);

export default router;