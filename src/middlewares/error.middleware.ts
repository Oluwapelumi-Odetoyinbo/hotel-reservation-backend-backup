import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/response';
import  logger  from '../utils/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): Response => {
  logger.error(`Error: ${err.message}`);
  return errorResponse(res, err.message, 500, err.stack);
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ message: 'Not Found' });
  };