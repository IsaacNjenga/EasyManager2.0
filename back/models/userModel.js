import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String },
    number: { type: String, unique: true },
    role: { type: String },
    password: { type: String },
  },
  { collection: "users", timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
