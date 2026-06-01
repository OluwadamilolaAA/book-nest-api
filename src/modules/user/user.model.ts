import mongoose, { Schema, Document } from "mongoose";

export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: Role;
  isEmailVerified: boolean;
  verificationToken: string;
  verified?: Date;
  passwordToken: string;
  passwordTokenExpirationDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  provider: "local" | "google" | "github";
  googleId?: string;
  githubId?: string;
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
      required: function (this: IUser): boolean {
        return this.provider === "local";
      },
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
      type: Date,
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
    provider: {
      type: String,
      enum: ["local", "google", "github"],
      default: "local",
    },

    googleId: {
      type: String,
    },
    githubId: {
      type: String,
    },
  },
  { timestamps: true, versionKey: false },
);
const User = mongoose.model<IUser>("User", UserSchema);
export default User;
