import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password?: string;
  categories: string[];
}

const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: false, // Optional to allow for legacy accounts or guest mode without complex migrations
  },
  categories: {
    type: [String],
    default: ['Food', 'Travel', 'Bills', 'Shopping']
  }
}, { timestamps: true });

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
