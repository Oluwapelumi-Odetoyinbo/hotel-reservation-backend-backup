import { NextFunction, Request, Response } from 'express';
import { loginUser, changePassword } from '../services/auth.service';
import { successResponse, errorResponse } from '../utils/response';
import { validate } from '../middlewares/validation.middleware';
import { body, validationResult } from 'express-validator';
import  logger  from '../utils/logger';
import { IAuthTokenPayload } from '../interfaces/auth.interface';

export const adminLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await Promise.all([
            body('email').isEmail().withMessage('Invalid email').run(req),
            body('password').notEmpty().withMessage('Password required').run(req)
        ]);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            errorResponse(res, 'Validation failed', 400, errors.array());
            return;
        }

        const { email, password } = req.body;
        logger.info(`Admin login attempt: ${email}`);
        const { user, token } = await loginUser({ email, password }, true); // Pass isAdminLogin=true

        successResponse(res, { user, token }, 'Admin login successful');
    } catch (error) {
        logger.error(`Admin login error: ${error}`);
        errorResponse(res, 'Invalid credentials', 401);
    }
};

export const customerLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        await Promise.all([
            body('email').isEmail().withMessage('Valid email is required').run(req),
            body('password').notEmpty().withMessage('Password is required').run(req),
        ]);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            errorResponse(res, 'Validation failed', 400, errors.array());
            return;
        }

        const { email, password } = req.body;
        logger.info(`Customer login attempt: ${email}`);
        const { user, token, isDefaultPassword } = await loginUser({ email, password });


        // Check if user is customer
        if (user.role !== 'customer') {
            logger.error(`Customer role required for user: ${email}`);
            errorResponse(res, 'Unauthorized access', 403);
            return;
        }

        successResponse(res, { user, token, isDefaultPassword }, 'Login successful');
    } catch (error) {
        logger.error(`Customer login error: ${error}`);
        errorResponse(res, 'user not found or inactive', 401);
    }
};
  

  export const changeUserPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Inline validation
        await Promise.all([
            body('oldPassword').notEmpty().withMessage('Old password is required').run(req),
            body('newPassword')
                .isLength({ min: 6 })
                .withMessage('New password must be at least 6 characters')
                .run(req),
        ]);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            errorResponse(res, 'Validation failed', 400, errors.array());
            return;
        }

        if (!req.user) {
            errorResponse(res, 'User not authenticated', 401);
            return;
        }

        const user = req.user as IAuthTokenPayload;
        await changePassword(user.id, req.body);

        successResponse(res, null, 'Password changed successfully');
    } catch (error) {
        logger.error(`Password change error: ${error}`);
        errorResponse(
            res,
            error instanceof Error ? error.message : 'An unknown error occurred',
            400
        );
    }
};
  