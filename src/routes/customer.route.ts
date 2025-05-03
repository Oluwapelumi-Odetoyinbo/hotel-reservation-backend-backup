import { Router } from 'express';
import { createCustomerHandler, getCustomersHandler } from '../controllers/customer.controllers';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Admin-only routes
router.post('/', authenticate, authorize(['admin', 'superAdmin']), createCustomerHandler);
router.get('/', getCustomersHandler);

export default router;