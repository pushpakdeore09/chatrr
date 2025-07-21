import { validationResult } from "express-validator";
import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";

export const createProfileController = async (req, res) => {

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
      userId,
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

export const getProfileController = async (req, res) => {
  const { userId } = req.query;
  

  try {
    const profile = await Profile.findOne({ userId });
    
    if (!profile) {
      return res.status(400).send("User not found");
    }

    return res.status(200).send(profile);
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

export const updateProfileController = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res
        .status(400)
        .json({ message: "userId is required in the URL." });
    }

    const {
      firstName,
      lastName,
      email,
      bio,
      profilePicture,
      phoneNumber,
      dob,
      gender,
    } = req.body;

    const existingProfile = await Profile.findOne({ userId });

    if (!existingProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    if (firstName !== undefined) existingProfile.firstName = firstName;
    if (lastName !== undefined) existingProfile.lastName = lastName;
    if (email !== undefined) existingProfile.email = email;
    if (bio != undefined) existingProfile.bio = bio;
    if (profilePicture !== undefined)
      existingProfile.profilePicture = profilePicture;
    if (phoneNumber !== undefined) existingProfile.phoneNumber = phoneNumber;
    if (dob !== undefined) existingProfile.dob = dob;
    if (gender !== undefined) existingProfile.gender = gender;

    await existingProfile.save();

    return res.status(200).json(existingProfile);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
