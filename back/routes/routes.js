import express from "express";
import { Register, Login, Auth } from "../controllers/userController.js";
import { VerifyUser } from "../middleware/verifyUser.js";
import { deleteImage } from "../controllers/cloudinaryController.js";
import { getProducts } from "../controllers/productController.js";
import { getSales } from "../controllers/saleController.js";
import { getExpenses } from "../controllers/expenseController.js";

//Routes
const router = express.Router();

//user control endpoints
router.post("/register", Register);
router.post("/login", Login);
router.get("/verify", VerifyUser, Auth);

//product routes
router.get("/products", getProducts);

//sales routes
router.get("/sales", getSales);

//expenses routes
router.get("/expenses", getExpenses);
//cloudinary routes
router.delete("/delete-image", VerifyUser, deleteImage);

export { router as Router };
