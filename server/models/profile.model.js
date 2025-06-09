import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },

  profilePicture: String,
  phoneNumber: {
    type: String,
    maxLength: 15,
  },
  dob: Date,
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
  },
});

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;