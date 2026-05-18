import mongoose, { Document, Schema } from "mongoose";

export interface IToken extends Document {
  user: mongoose.Types.ObjectId;

  refreshToken: string;

  userAgent: string;

  ip: string;

  isValid: boolean;

  expiresAt: Date;
}

const TokenSchema = new Schema<IToken>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    refreshToken: {
      type: String,
      required: true,
    },

    userAgent: {
      type: String,
      required: true,
    },

    ip: {
      type: String,
      required: true,
    },

    isValid: {
      type: Boolean,
      default: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },

  {
    timestamps: true, versionKey: false
  }
);

const Token = mongoose.model<IToken>(
  "Token",
  TokenSchema
);

export default Token;