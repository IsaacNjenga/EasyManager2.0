import express from "express";
import { Register, Login, Auth } from "../controllers/userController.js";
import { VerifyUser } from "../middleware/verifyUser.js";
import { deleteImage } from "../controllers/cloudinaryController.js";
import {
  addProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/productController.js";
import { addSale, getSales } from "../controllers/saleController.js";
import { getExpenses } from "../controllers/expenseController.js";

//Routes
const router = express.Router();

//user control endpoints
router.post("/register", Register);
router.post("/login", Login);
router.get("/verify", VerifyUser, Auth);

//product routes
router.post("/add-product", addProduct);
router.get("/products", getProducts);
router.get("/product/:id", getProduct);
router.put("/update-product/:id", updateProduct);
router.delete("/delete-product", deleteProduct);

//sales routes
router.post("/add-sale", addSale);
router.get("/sales", getSales);

//expenses routes
router.get("/expenses", getExpenses);
//cloudinary routes
router.delete("/delete-image", VerifyUser, deleteImage);

export { router as Router };
