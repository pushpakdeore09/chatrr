import Profile from "../models/profile.model.js";
export const createProfile = async (req, userId) => {
  const { firstName, lastName, email } = req.body;

  if (!firstName || !lastName || !email) {
    throw new Error("All fields are required");
  }

  const existingUser = await Profile.findOne({ email });

  if (!existingUser) {
    const userProfile = await Profile.create({
      userId,
      firstName,
      lastName,
      email,
      bio: "",
      profilePicture: "",
      phoneNumber: "",
      dob: "",
      gender: ""
    });
    return userProfile;
  }
  throw new Error("User already exists");
};
