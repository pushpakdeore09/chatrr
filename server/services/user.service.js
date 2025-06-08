import userSchema from "../models/user.model.js";
import nodemailer from "nodemailer";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";

export const createUser = async (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    throw new Error(
      "All fields (firstName, lastName, email, password) are required"
    );
  }

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    return user;
  }
  throw new Error("User already exists");
};

export function generateOtp() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
}

export async function sendResetPasswordEmail(email, otp) {
  console.log(`Sending OTP ${otp} to ${email}`);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "pushpak.deore04@gmail.com",
    },
  });

  const mailOptions = {
    from: "pushpak.deore04@gmail.com",
    to: email,
    subject: "Reset Password OTP",
    text: `Your OTP for password reset is ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.log("Error sending email:", error);
  }
}
