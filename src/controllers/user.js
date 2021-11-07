import bcrypt from "bcrypt";
import models from "../models";
import sendGrid from "../utils/sendgrid";
import { successResponse } from "../utils/responses";
import jwtHelper from "../utils/jwt";

const { generateToken } = jwtHelper;
const { sendVerification, sendResetPasswordEmail } = sendGrid;
/**
 * @class UserController
 * @description create, verify and log in user
 * @exports UserController
 */
export default class UserController {
  /**
   * @param {object} req - The reset request object
   * @param {object} res - The reset errorResponse object
   * @returns {object} Success message
   */
  static async createUser(req, res) {
    const {
      username, phone, email, password
    } = req.body;
    const emailExist = await models.User.findOne({ email });
    if (emailExist) {
      return res.status(409).json({ status: 409, error: "email already registered by another user." });
    }
    const phoneExist = await models.User.findOne({ phone });
    if (phoneExist) {
      return res.status(409).json({ status: 409, error: "phone number already used by another user." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await models.User.create({
      username, email, password: hashedPassword, phone
    });
    const token = Math.floor(Math.random() * 314112 + 12124);
    await models.Otp.create({ token, email });
    await sendVerification(email, username, token);
    return successResponse(
      res, 201,
      `A verification code has been sent to ${email}, Copy the token therein to verify your account.`
    );
  }

  /**
   * @param {object} req - The reset request object
   * @param {object} res - The reset response object
   * @returns {object} Success message
   */
  static async verifyUser(req, res) {
    const { token, email } = req.body;
    const validOtp = await models.Otp.findOne({ token });
    if (!validOtp || validOtp.expired) {
      return res.status(401).json({ status: 401, error: "Token is invalid or expired, request for a new Token." });
    }

    await models.Otp.findByIdAndUpdate(
      validOtp._id,
      { expired: true },
      { new: true }
    );

    await models.User.findOneAndUpdate(
      { email },
      { verified: true },
      { new: true }
    );
    return successResponse(
      res,
      200,
      "Phone number has been verified, Kindly login to your account"
    );
  }

  /**
   * @param {object} req - The reset request object
   * @param {object} res - The reset errorResponse object
   * @returns {object} Success message
   */
  static async signin(req, res) {
    const { username, password } = req.body;
    const user = await models.User.findOne({
      $or: [{ email: username }, { username }, { phone: username }],
    });
    if (!user) { return res.status(404).json({ status: 404, error: "User details supplied does not exist." }); }
    if (!user.verified) { return res.status(400).json({ status: 400, error: "Please kindly verify your account." }); }
    const validpass = await bcrypt.compare(password, user.password);
    if (!validpass) { return res.status(404).json({ status: 404, error: "Password is not correct!." }); }
    const { _id, email } = user;
    const token = await generateToken({ _id, email, username });
    return successResponse(
      res,
      200,
      "User Logged in Successfully.",
      token
    );
  }

  /**
   * @param {object} req - The reset request object
   * @param {object} res - The reset errorResponse object
   * @returns {object} Success message
   */
  static async uploadPicture(req, res) {
    const { _id } = req.user;
    const userExist = await models.User.findById({ _id });
    if (!userExist) { return res.status(409).json({ status: 409, error: "User Does Not Exist." }); }

    if (!req.file) { return res.status(409).json({ status: 409, error: "you have to upload an image" }); }
    const user = await models.User.findByIdAndUpdate(
      { _id },
      { profilePhoto: req.file.path },
      { new: true }
    ).select("-password");
    return successResponse(res, 200, "Profile picture Updated Successfully", user);
  }

  /**
   * @param {object} req - The user request object
   * @param {object} res - The user response object
   * @returns {object} Success message
   */
  static async updateProfile(req, res) {
    const { _id } = req.user;
    const { firstName, lastName } = req.body;
    const user = await models.User.findByIdAndUpdate(
      { _id },
      { firstName, lastName },
      { new: true }
    ).select("-password");
    return successResponse(
      res,
      200,
      "Profile updated Successfully",
      user
    );
  }

  /**
   * @param {object} req - The user request object
   * @param {object} res - The user response object
   * @returns {object} Success message
   */
  static async recoverAccount(req, res) {
    const { email } = req.body;
    const user = await models.User.findOne({ email });
    if (!user) { return res.status(409).json({ status: 409, error: "The phone number does not exist" }); }
    const token = Math.floor(Math.random() * 314112 + 12124);
    await models.Otp.create({ token, user: user._id, email });
    await sendResetPasswordEmail(email, token);

    return successResponse(
      res,
      200,
      `A verification code has been sent to ${email}, Copy the token therein to reset your password`
    );
  }

  /**
   * @param {object} req - The reset request object
   * @param {object} res - The reset response object
   * @returns {object} Success message
   */
  static async resetPassword(req, res) {
    const { token, password, retypePassword } = req.body;
    const userOtp = await models.Otp.findOne({ token });
    const user = await models.User.findOne({ email: userOtp.email });

    if (!userOtp || userOtp.expired) { return res.status(404).json({ status: 404, error: "Token is invalid or expired" }); }
    if (password !== retypePassword) {
      return res.status(409).json({ status: 409, error: "Password MissMatch." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const passwordDetails = { password: hashedPassword };
    await models.User.findByIdAndUpdate({ _id: user._id }, passwordDetails);
    await models.Otp.findByIdAndUpdate(
      userOtp._id,
      { expired: true },
      { new: true }
    );
    return successResponse(
      res,
      200,
      "User password updated successfully"
    );
  }
}
