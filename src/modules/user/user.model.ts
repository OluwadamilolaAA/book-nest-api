import mongoose, { Schema, Document } from "mongoose";

export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: Role;
  isEmailVerified: boolean;
  verificationToken: string;
  verified?: Date;
  passwordToken: string;
  passwordTokenExpirationDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    verified: {
      type: Date
    },
    verificationToken: {
      type: String,
    },
    passwordToken: {
      type: String,
    },
    passwordTokenExpirationDate: {
      type: Date,
    },
  },
  { timestamps: true, versionKey: false },
);
const User = mongoose.model<IUser>("User", UserSchema);
export default User;
