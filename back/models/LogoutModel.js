import mongoose from "mongoose";

const logoutSchema = new mongoose.Schema(
  {
    number: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String },
    logoutTime: { type: String, required: true },
  },
  { collection: "logouts", timestamps: true }
);

const LogoutModel = mongoose.model("Logout", logoutSchema);

export default LogoutModel;
