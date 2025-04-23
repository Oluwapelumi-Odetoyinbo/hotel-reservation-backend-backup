import app from './app';
import connectDB from './configs/db';
import { UserModel } from './models/user.model';
import logger from './utils/logger';
import crypto from 'bcrypt';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const startServer = async (): Promise<void> => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            logger.info(`Server running on port ${PORT}`);
        });
    } catch (error) {
        logger.error(`Failed to start server: ${error}`);
        process.exit(1);
    }
};

const createAdmin = async () => {
  try {
      const admin = await UserModel.create({
          name: 'Admin',
          email: 'odetoyinbopelumi@gmail.com',
          password: 'admin123', // Will be hashed
          role: 'admin',
          status: true
      });
      logger.info(`Admin created: ${admin._id}`);
  } catch (error) {
      logger.error(`Admin creation error: ${error}`);
  }
};

createAdmin();

startServer();