import { Schema, model } from 'mongoose';

const tokenSchema = new Schema(
  {
    token: {
      type: String,
      default: null,
      trim: true,
    },
    exp: {
      type: Number,
      default: null,
    },
    iat: {
      type: Number,
      default: null,
    },
    type: {
      type: String,
      enum: ["JWT", "FORGOT-PASS", null],
      default: null,
    },
  },
  {
    versionKey: false,
  }
);

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    account_confirmed: {
      type: Boolean,
      default: false,
    },
    tokens: {
      type: [tokenSchema],
    },
    full_name: {
      type: String,
      trim: true,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("User", userSchema);
