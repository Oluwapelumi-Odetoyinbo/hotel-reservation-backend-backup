import { UserModel, IUser, UserRole } from '../models/user.model';
import { IAuthLogin, IAuthTokenPayload, IAuthChangePassword } from '../interfaces/auth.interface';
import { generateToken } from '../utils/token';
import  logger  from '../utils/logger';
import bcrypt from 'bcrypt';

export const loginUser = async (loginData: IAuthLogin, isAdminLogin = false): Promise<{ user: IUser; token: string }> => {
    const { email, password } = loginData;

    logger.info(`Login attempt for email: ${email}`);
    
    // Enhanced debug logging
    logger.debug(`Input password: ${password}`);
    
    const user = await UserModel.findOne({
        email: { $regex: new RegExp(`^${email}$`, 'i') },
        status: true
    }).select('+password');

    if (!user) {
        logger.error(`User not found or inactive: ${email}`);
        throw new Error('Invalid credentials');
    }

    // Add password hash to logs
    logger.debug(`Stored password hash: ${user.password.substring(0, 15)}...`);

    // Direct bcrypt comparison (bypass user method temporarily)
    const isMatch = await bcrypt.compare(password, user.password);
    logger.debug(`Bcrypt compare result: ${isMatch}`);
    
    if (!isMatch) {
        logger.error(`Password mismatch for user: ${email}`);
        throw new Error('Invalid credentials');
    }

    return {
        user: user.toObject({ virtuals: true }),
        token: generateToken({
            id: user._id.toString(),
            email: user.email,
            role: user.role
        })
    };
};
export const changePassword = async (
  userId: string,
  passwordData: IAuthChangePassword,
): Promise<void> => {
  const { oldPassword, newPassword } = passwordData;

  // Get user with password
  const user = await UserModel.findById(userId).select('+password');
  if (!user) {
    logger.error(`User with id ${userId} not found`);
    throw new Error('User not found');
  }

  // Verify old password
  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) {
    logger.error(`Invalid old password for user ${user.email}`);
    throw new Error('Old password is incorrect');
  }

  // Hash new password and save
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  await user.save();

  logger.info(`Password changed successfully for user ${user.email}`);
};