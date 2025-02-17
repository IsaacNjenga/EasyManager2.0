import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserModel from "../models/userModel.js";

dotenv.config();

const Register = async (req, res) => {
  const { name, number, role, password } = req.body;
  try {
    const userExist = await UserModel.findOne({ number });
    if (userExist) {
      return res.status(400).json({ error: "ID number is already taken" });
    }
    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new UserModel({
      name,
      number,
      role,
      password: hashPassword,
    });
    const result = await newUser.save();
    result._doc.password = undefined;
    return res.status(201).json({ success: true, ...result._doc });
  } catch (error) {
    console.error("Error during sign up:", error);
    res.status(500).json({ error: "Server error, please try again later" });
  }
};

const Login = async (req, res) => {
  const { number, password } = req.body;
  try {
    // Find user by number
    const userExist = await UserModel.findOne({ number });
    if (!userExist) {
      return res.json({ error: "User not found" });
    }

    const name = userExist.name;
    const role = userExist.role;
    // Compare passwords
    const match = bcrypt.compare(password, userExist.password);
    if (!match) {
      return res.json({ error: "Incorrect password. Try again" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        number: userExist.number,
        id: userExist._id,
        role: userExist.role,
        name: userExist.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    const user = { ...userExist._doc, password: undefined };
    return res.status(201).json({ success: true, user, token });
  } catch (err) {
    console.error("Error in login:", err);
    return res.status(500).json({ error: err.message });
  }
};

const Auth = (req, res) => {
  return res.status(201).json({ success: true, user: { ...req.user._doc } });
};

export { Auth, Login, Register };
