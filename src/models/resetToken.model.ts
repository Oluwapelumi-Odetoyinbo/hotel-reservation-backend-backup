import {model , Schema, Document} from 'mongoose';

export interface IPasswordResetToken extends Document {
    userId: string;
    token: string;
    createdAt: Date;
}

const passwordResetTokenSchema: Schema = new Schema<IPasswordResetToken>({
    userId: {
        type: String,
        required: true,
        ref: 'User',
    },
    token: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: Date.now() + 3600000, // expires in 1 hour
    }
})

export const passwordResetTokenModel = model<IPasswordResetToken>('PasswordResetToken', passwordResetTokenSchema);