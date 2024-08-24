import mongoose, {Document, Schema} from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  avatar: string;
  role: string;
  isVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  verificationRequests: number;
}

const UserSchema: Schema<IUser> = new Schema({
  username: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  avatar: {type: String, default: "default-avatar.jpg"},
  role: {
    type: String,
    required: true,
    enum: ["user", "admin"],
    default: "user",
  },
  isVerified: {type: Boolean, default: false},
  emailVerificationToken: {type: String},
  emailVerificationExpires: {type: Date},
  verificationRequests: {type: Number, default: 0},
});

export const User = mongoose.model<IUser>("User", UserSchema);
