import express from "express";
import { Register, Login, Auth } from "../controllers/userController.js";
import { VerifyUser } from "../middleware/verifyUser.js";

//Routes
const router = express.Router();

//user control endpoints
router.post("/register", Register);
router.post("/login", Login);
router.get("/verify", VerifyUser, Auth);

export { router as Router };
