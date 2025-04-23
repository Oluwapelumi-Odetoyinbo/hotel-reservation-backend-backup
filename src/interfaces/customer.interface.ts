import { IUserInput } from './user.interface';

export interface ICustomerInput extends IUserInput {
  sendEmail?: boolean;
}