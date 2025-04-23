import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/token';
import { errorResponse } from '../utils/response';
import { UserModel } from '../models/user.model';
import { IUser } from '../interfaces/user.interface';

import  logger  from '../utils/logger';



export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
  
      if (!token) {
        errorResponse(res, 'Authentication required', 401);
        return;
      }
  
      const decoded = verifyToken(token);
      if (!decoded) {
        errorResponse(res, 'Invalid token', 401);
        return;
      }
  
      const user = await UserModel.findOne({ _id: decoded.id, status: true });
      if (!user) {
        errorResponse(res, 'User not found or inactive', 401);
        return;
      }
  
      req.user = user as IUser;
      next(); // success path
    } catch (error) {
      logger.error(`Authentication error: ${error}`);
      errorResponse(res, 'Authentication failed', 401);
    }
  };
  
  export const authorize = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const userRole = req.user?.role;
  
      if (!userRole || !roles.includes(userRole)) {
        res.status(403).json({ message: 'Forbidden' });
      } else {
        next();
      }
    };
  };
  