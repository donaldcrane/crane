const { Schema, model } = require("mongoose");
const m = require("moment");
const OtpSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    token: {
      type: Number,
      required: true,
    },
    expireAt: {
      type: Date,
      default: m.utc().add(60, "minutes"),
      expires: "60m",
    },
    expired: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = {
  OtpSchema,
  Otp: model("otp", OtpSchema),
};
