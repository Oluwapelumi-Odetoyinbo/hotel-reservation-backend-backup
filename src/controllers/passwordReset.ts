import { NextFunction, Request, Response } from "express";
import { requestPasswordReset, resetPassword } from "../services/auth.service";
import { successResponse, errorResponse } from "../utils/response";
import { validate } from "../middlewares/validation.middleware";
import { body, validationResult } from "express-validator";
import logger from "../utils/logger";



export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
      await Promise.all([
          body('email').isEmail().withMessage('Valid email is required').run(req)
      ]);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          errorResponse(res, 'Validation failed', 400, errors.array());
          return;
      }

      const { email } = req.body;
      logger.info(`Forgot password requested for: ${email}`);

      await requestPasswordReset(email);

      successResponse(res, null, 'A password reset link has been sent to your email');
  } catch (error) {
      logger.error(`Password reset error: ${error}`);
      errorResponse(res, 'Something went wrong', 500);
  }
};

export const resetPasswordHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await Promise.all([
      body('token').notEmpty().withMessage('Token is required').run(req),
      body('newPassword')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters')
        .run(req),
    ]);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      errorResponse(res, 'Validation failed', 400, errors.array());
      return;
    }

    const { token, newPassword } = req.body;
    await resetPassword(token, newPassword);

    successResponse(res, null, 'Password reset successfully');
  } catch (error) {
    logger.error(`Password reset error: ${error}`);
    errorResponse(res, 'Something went wrong', 400);
  }
};