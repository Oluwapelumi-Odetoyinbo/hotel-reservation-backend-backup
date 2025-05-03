import { NextFunction, Request, Response } from 'express';
import { createCustomer } from '../services/customer.service';
import { successResponse, errorResponse } from '../utils/response';
import { validate } from '../middlewares/validation.middleware';
import { body, validationResult } from 'express-validator';
import  logger  from '../utils/logger';
import { getCustomers } from '../services/customer.service'; // make sure this exists


export const createCustomerHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Inline validation
      await Promise.all([
        body('name').notEmpty().withMessage('Name is required').run(req),
        body('email').isEmail().withMessage('Valid email is required').run(req),
      ]);
  
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        errorResponse(res, 'Validation failed', 400, errors.array());
        return;
      }
  
      const customer = await createCustomer({
        ...req.body,
        role: 'customer',
        sendEmail: true,
      });
  
      successResponse(res, customer, 'Customer created successfully', 201);
    } catch (error) {
      logger.error(`Create customer error: ${error}`);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      errorResponse(res, errorMessage, 400);
    }
  };
  
  export const getCustomersHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const customers = await getCustomers();
      successResponse(res, customers, 'Customers fetched successfully');
    } catch (error) {
      logger.error(`Fetch customers error: ${error}`);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      errorResponse(res, errorMessage, 500);
    }
  };