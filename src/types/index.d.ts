import { IUser } from '../../models/user'; // Adjust path to your actual user interface

declare module 'express-serve-static-core' {
  interface Request {
    user?: IUser;
  }
}
