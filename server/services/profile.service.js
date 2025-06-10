import Profile from "../model/profile.model.js";
export const createProfile = async (req) => {
  const { firstName, lastName, email } = req.body;

  if (!firstName || !lastName || !email || !password) {
    throw new Error(
      "All fields (firstName, lastName, email) are required"
    );
  }

  const existingUser = await Profile.findOne({ email });

  if (!existingUser) {
    const userProfile = await Profile.create({
      firstName,
      lastName,
      email,
    });
    return userProfile;
  }
  throw new Error("User already exists");
};
