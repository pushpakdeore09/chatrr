import userSchema from "../models/user.model.js";
import * as userService from "../services/user.service.js";
import { validationResult } from "express-validator";
import redisClient from "../services/redis.service.js";
import * as profileService from "../services/profile.service.js";
import bcrypt from "bcrypt";

export const registerController = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await userService.createUser(req);
    const token = user.generateJwt();
    const profile = await profileService.createProfile(req, user._id);

    if (profile) {
      res.status(201).send({ user, token });
    }
  } catch (error) {
    console.log(error.message);
    
    res.status(400).send(error.message);
  }
};

export const loginController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    const user = await userSchema.findOne({ email });

    if (!user) {
      return res.status(400).send("Invalid Credentials");
    }
    const isPasswordMatch = await user.isValidPassword(password);
    if (!isPasswordMatch) {
      return res.status(400).send("Invalid Credentials");
    }
    const token = await user.generateJwt();
    res.status(200).json({ user, token });
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

export const sendOTPController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email } = req.body;
    const user = await userSchema.findOne({ email });
    if (!user) {
      return res.status(400).json({ errors: "User not found" });
    }
    const otp = userService.generateOtp();
    await userService.sendResetPasswordEmail(email, otp);
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000;
    await user.save();
    const isEmailSent = await userService.sendResetPasswordEmail(email, otp);
    if (!isEmailSent) {
      return res.status(500).json({ errors: "Failed to send email" });
    }
    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const verifyOtpController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, otp } = req.body;
    const user = await userSchema.findOne({ email });
    if (!user) {
      return res.status(400).json({ errors: "User not found" });
    }
    if (user.resetOtp !== otp) {
      return res.status(400).json({ errors: "Invalid OTP" });
    }
    if (user.resetOtpExpireAt < Date.now()) {
      return res.status(400).json({ errors: "OTP expired" });
    }
    res.status(200).json({ message: "OTP Verified Successfully!" });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const forgotPasswordController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, newPassword } = req.body;
    const user = await userSchema.findOne({ email });
    if (!user) {
      return res.status(400).json({ errors: "User not found" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = null;
    user.resetOtpExpireAt = null;
    await user.save();
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const logoutController = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    redisClient.set(token, "logout", "EX", 60 * 60 * 24);
    res.status(200).send("Logout successful");
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

export const getUserSearchController = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { firstName: { $regex: req.query.search, $options: "i" } },
          { lastName: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  try {
    const users = await userSchema
      .find({
        ...keyword,
        _id: { $ne: req.user._id },
      })
      .select("_id firstName lastName email");

    res.status(200).json(users);
  } catch (error) {
    console.error("Search failed:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
