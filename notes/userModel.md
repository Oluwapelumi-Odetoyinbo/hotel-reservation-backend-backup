User Model Explanation
This note explains a Mongoose User model for a Node.js/Express/TypeScript backend with MongoDB, using bcrypt for password hashing.
Code
import { model, Document, Schema } from 'mongoose';
import { IUser, UserRole } from '../interfaces/user.interface';
import bcrypt from 'bcrypt';

const UserSchema: Schema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, trim: true, lowercase: true },
        password: { type: String, required: true },
        role: { type: String, enum: Object.values(UserRole), default: UserRole.CUSTOMER },
        status: { type: Boolean, default: true },
    },
    { timestamps: true }
);

// Hash password before saving
UserSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error as Error);
    }
});

// Compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

export const UserModel = model<IUser>('User', UserSchema);

Breakdown

Imports:

mongoose: For schemas and models.
IUser, UserRole: TypeScript interfaces for user and roles.
bcrypt: For password hashing/comparison.
TypeScript: Uses IUser for type safety; needs @types/bcrypt.


Schema:

Fields: name, email (unique), password, role (enum), status.
timestamps: true: Adds createdAt, updatedAt.
TypeScript: Tied to IUser interface.


Password Hashing:

pre('save'): Hashes password if modified, using bcrypt (10 rounds).
Skips if password unchanged.


Password Comparison:

methods.comparePassword: Compares input password with stored hash.
Returns Promise<boolean>.


Model:

model<IUser>('User', UserSchema): Creates User model for CRUD.
TypeScript: Returns IUser documents.



Usage Example

Register user:const user = await UserModel.create({ name: 'John', email: 'john@example.com', password: 'pass123' });


Login:const user = await UserModel.findOne({ email: 'john@example.com' });
const isMatch = await user?.comparePassword('pass123');



Best Practices

Validate email: Add match regex.
Exclude password: Use toJSON transform.
Log errors: Add logger.error in hook.
Index: Call UserModel.createIndexes().

Pitfalls

Schema typo: Fixed password vs. role.
Duplicate emails: Ensure unique index.
Bcrypt errors: Handle gracefully.

Study Tips

Test: Create a user and verify hashed password.
Review: Mongoose docs (https://mongoosejs.com/docs/models.html).

