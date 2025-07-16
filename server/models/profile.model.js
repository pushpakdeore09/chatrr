import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    default: function() {
      return this._id; 
    },
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
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
  bio: String,
  profilePicture: String,
  phoneNumber: {
    type: String,
    maxLength: 15,
  },
  dob: Date,
  gender: {
    type: String,
  },
});

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;
