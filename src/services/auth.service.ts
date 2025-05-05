import { UserModel, IUser, UserRole } from '../models/user.model';
import { IAuthLogin, IAuthTokenPayload, IAuthChangePassword } from '../interfaces/auth.interface';
import { generateToken, verifyResetToken } from '../utils/token';
import logger from '../utils/logger';
import bcrypt from 'bcrypt';
import { passwordResetTokenModel } from '../models/resetToken.model';

// Define the default password constant
const DEFAULT_PASSWORD = 'Reserve123!'; // Default password for new users
import { generateResetToken } from '../utils/token';
import { sendPasswordResetEmail } from './mail.service';

export const loginUser = async (
  loginData: IAuthLogin,
  isAdminLogin = false,
): Promise<{ user: IUser; token: string; isDefaultPassword: boolean }> => {
  const { email, password } = loginData;

  logger.info(`Login attempt for email: ${email}`);
  logger.debug(`Input password: ${password}`);

  const user = await UserModel.findOne({
    email: { $regex: new RegExp(`^${email}$`, 'i') },
    status: true,
  }).select('+password');

  if (!user) {
    logger.error(`User not found or inactive: ${email}`);
    throw new Error('User not found or inactive');
  }

  logger.debug(`Stored password hash: ${user.password?.substring(0, 15)}...`);

  const isMatch = await bcrypt.compare(password, user.password);
  logger.debug(`Bcrypt compare result: ${isMatch}`);

  if (!isMatch) {
    logger.error(`Password mismatch for user: ${email}`);
    throw new Error('Invalid credentials');
  }

  if (isAdminLogin && user.role !== 'admin' && user.role !== 'superAdmin') {
    logger.error(`Unauthorized admin login attempt by: ${email}`);
    throw new Error('Unauthorized');
  }

  const isDefaultPassword = await bcrypt.compare(DEFAULT_PASSWORD, user.password);
  user.isDefaultPassword = isDefaultPassword;

  return {
    user: user.toObject({ virtuals: true }) as IUser,
    token: generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    }),
    isDefaultPassword,
  };
};



export const changePassword = async (
  userId: string,
  passwordData: IAuthChangePassword,
): Promise<void> => {
  const { oldPassword, newPassword } = passwordData;

  const user = await UserModel.findById(userId).select('+password');
  if (!user) {
    logger.error(`User with id ${userId} not found`);
    throw new Error('User not found');
  }

  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) {
    logger.error(`Invalid old password for user ${user.email}`);
    throw new Error('Old password is incorrect');
  }

  user.password = newPassword;

  user.isDefaultPassword = false;

  user.isDefaultPassword = false;
  await user.save();

  logger.info(`Password changed successfully for user ${user.email}`);
};

export const requestPasswordReset = async (email: string): Promise<void> => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    logger.error(`Password reset requested for non-existent email: ${email}`);
    return;
  }

  await passwordResetTokenModel.deleteMany({ userId: user._id });

  const token = generateResetToken(user._id.toString());
  await passwordResetTokenModel.create({
    userId: user._id,
    token,
  });

  await sendPasswordResetEmail(user.email, token);
  logger.info(`Password reset token generated for user ${user.email}`);
};

export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  const userId = verifyResetToken(token);

  const resetToken = await passwordResetTokenModel.findOne({ token });
  if (!resetToken) {
    logger.error(`Invalid or expired password reset token: ${userId}`);
    throw new Error('Invalid or expired token');
  }

  const user = await UserModel.findById(userId);
  if (!user) {
    logger.error(`User not found for reset token: ${userId}`);
    throw new Error('User not found');
  }

  // Hash and save new password
  // const salt = await bcrypt.genSalt(10);
  // user.password = await bcrypt.hash(newPassword, salt);
  // await user.save();
  user.password = newPassword;
  await user.save();

  await passwordResetTokenModel.deleteOne({ token });

  logger.info(`Password reset successfully for user ${user.email}`);
};
