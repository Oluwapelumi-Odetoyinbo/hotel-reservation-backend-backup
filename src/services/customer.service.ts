import { UserModel, IUser, UserRole } from '../models/user.model';
import { ICustomerInput } from '../interfaces/customer.interface';
import  logger  from '../utils/logger';
import transporter from '../configs/mail';
import bcrypt from 'bcrypt';
import path from 'path';

const DEFAULT_PASSWORD = 'Reserve123!'; // Default password for new customers

export const createCustomer = async (customerData: ICustomerInput): Promise<IUser> => {
  const { name, email, role = UserRole.CUSTOMER, status = true, sendEmail = true } = customerData;

  // Check if customer already exists
  const existingCustomer = await UserModel.findOne({ email });
  if (existingCustomer) {
    logger.error(`Customer with email ${email} already exists`);
    throw new Error('Customer already exists');
  }


  // Create customer
  const customer = await UserModel.create({
    name,
    email,
    password: DEFAULT_PASSWORD,
    role,
    status,
    isDefaultPassword: true,
  });

  // Send email with credentials if requested
  if (sendEmail) {
    try {
      await transporter.sendMail({
        from: process.env.MAIL_FROM,
        to: email,
        subject: 'Your Hotel Reservation System Account Details',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #ddd; border-radius: 10px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="cid:hrsLogo" alt="HRS Logo" style="width: 100px;" />
            </div>
            <h2 style="color: #2c3e50; text-align: center;">Welcome to Hotel Reservation System</h2>
            <p style="font-size: 16px; color: #333;">
              Your account has been created successfully. Below are your login credentials:
            </p>
            <table style="margin: 20px 0; font-size: 16px; color: #333; width: 100%;">
              <tr>
                <td style="padding: 8px 0;"><strong>Email:</strong></td>
                <td style="padding: 8px 0;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Temporary Password:</strong></td>
                <td style="padding: 8px 0;">${DEFAULT_PASSWORD}</td>
              </tr>
            </table>
            <p style="font-size: 14px; color: #444;">
              <strong>Please make sure to change your password after your first login for security purposes.</strong>
            </p>
            <p style="font-size: 14px; color: #666; margin-top: 40px;">
              If you have any questions or need help, feel free to contact our support team.
            </p>
            <hr style="margin: 40px 0; border: none; border-top: 1px solid #eee;" />
            <p style="font-size: 12px; color: #999; text-align: center;">
              © ${new Date().getFullYear()} Hotel Reservation System. All rights reserved.
            </p>
          </div>
        `,
        attachments: [
          {
            filename: 'hrs.png',
            path: path.join(__dirname, '../emails/assets/hrs.png'),
            cid: 'hrsLogo' // Must match the cid used in the <img src="cid:hrsLogo" />
          }
        ]
        
      });
      logger.info(`Email sent successfully to ${email}`);
    } catch (error) {
      logger.error(`Error sending email to ${email}: ${error}`);
      // Don't throw error, just log it
    }
  }

  // Remove password before returning
  customer.password = undefined as any;

  return customer;
};

export const getCustomers = async () => {
  return UserModel.find({ role: 'customer' }).select('-password');
};