import { IAuthTokenPayload } from '../interfaces/auth.interface';

declare module 'express-serve-static-core' {
    interface Request {
        user?: IAuthTokenPayload; // Optional user for JWT payload
    }
}