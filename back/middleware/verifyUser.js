import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserModel from "../models/UserModel.js";

dotenv.config();
export const VerifyUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
      try {
        if (err) {
          return res.status(401).json({ error: "Unauthorised User" });
        }
        const user = await UserModel.findOne({ _id: payload._id }).select(
          "-password"
        );
        req.user = user;
        next();
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    });
  } else {
    return res.status(403).json({ error: "Forbidden" });
  }
};
