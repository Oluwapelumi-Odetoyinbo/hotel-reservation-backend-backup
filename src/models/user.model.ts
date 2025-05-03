import { model, Schema, Document } from 'mongoose';
import { IUser, UserRole } from '../interfaces/user.interface';
import bcrypt from 'bcrypt';

const userSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    role: {
        type: String,
        enum: ['admin', 'superAdmin', 'customer'],
        default: 'customer',
        required: true
    },
    status: {
      type: Boolean,
      default: true,
    },
    isDefaultPassword: {
      type: Boolean,
      default: true,
    }
  },
  {
    timestamps: true,
  },
);

// Hash password before saving
userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword: string) {
    return bcrypt.compare(candidatePassword, this.password);
  }

export const UserModel = model<IUser>('User', userSchema);

export { IUser, UserRole };
