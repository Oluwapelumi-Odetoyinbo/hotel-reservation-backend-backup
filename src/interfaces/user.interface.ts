import { Document } from 'mongoose';

export enum UserRole {
  ADMIN = 'admin',
  SUPER_ADMIN = 'superAdmin',
  CUSTOMER = 'customer',
}

export interface IUser extends Document {
    _id: string;  // Ensure this is included
  id: string; 
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: boolean;
  isDefaultPassword: boolean; 
  createdAt: Date;
  updatedAt: Date;

  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IUserInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  status?: boolean;
}