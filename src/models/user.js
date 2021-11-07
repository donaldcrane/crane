import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      maxlength: 60,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      maxlength: 50,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    phone: {
      type: String,
      unique: true,
    },
    profilePhoto: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = {
  userSchema,
  User: model("user", userSchema),
};
