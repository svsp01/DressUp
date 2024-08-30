import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  //   monthlyIncome: { type: Number, required: true },
  profileImageUrl: { type: String, required: true },
  bio: { type: String, required: true },
  //   skills: { type: [String],  required: true },
  //   interests: { type: [String],  required: true},
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
