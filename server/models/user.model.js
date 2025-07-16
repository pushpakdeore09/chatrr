import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      lowercase: true,
      minLength: [4, "Username must be at least 4 characters long"],
      maxLength: [50, "Username must not be longer than 50 characters"],
    },
    lastName: {
      type: String,
      required: true,
      lowercase: true,
      minLength: [4, "Username must be at least 4 characters long"],
      maxLength: [50, "Username must not be longer than 50 characters"],
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      minLength: [4, "Username must be at least 4 characters long"],
      maxLength: [50, "Username must not be longer than 50 characters"],
    },
    password: {
      type: String,
      required: true,
    },
    resetOtp: {
      type: String,
      default: null,
    },
    resetOtpExpireAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
userSchema.methods.generateJwt = function () {
  return jwt.sign({ _id: this._id.toString(), email: this.email }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const User = mongoose.model("User", userSchema);
export default User;
