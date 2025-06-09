import { validationResult } from "express-validator";
import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";

export const createProfileController = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { userId, bio, profilePicture, phoneNumber, dob, gender } = req.body;

    const existingUser = await User.findOne({ userId });

    if (!existingUser) {
      return res.status(400).send("User not found");
    }

    const userProfile = await Profile.create({
      profileId: userId,
      bio,
      profilePicture,
      phoneNumber,
      dob,
      gender,
    });

    return res.status(200).send(userProfile);
  } catch (error) {
    return res.status(400).send(error.message);
  }
};
