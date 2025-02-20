import express from "express";
import {
  Register,
  Login,
  Auth,
  credentialsChange,
} from "../controllers/userController.js";
import { VerifyUser } from "../middleware/verifyUser.js";
import { deleteImage } from "../controllers/cloudinaryController.js";
import {
  addProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/productController.js";
import {
  addSale,
  deleteSale,
  getSale,
  getSales,
  getSomeSales,
  updateSale,
} from "../controllers/saleController.js";
import {
  addExpense,
  deleteExpense,
  getExpense,
  getExpenses,
  updateExpense,
} from "../controllers/expenseController.js";
import {
  addSalesperson,
  deleteSalesperson,
  getSalespersons,
  getSalesperson,
  updateSalesperson,
} from "../controllers/salespersonController.js";
import { otpRequest, verifyOtp } from "../controllers/emailController.js";
import {
  getLogins,
  getLogouts,
  logout,
} from "../controllers/logsController.js";

//Routes
const router = express.Router();

//user control endpoints
router.post("/register", Register);
router.post("/login", Login);
router.get("/verify", VerifyUser, Auth);
router.post("/password-change", credentialsChange);

//mail routes
router.post("/otp-request", otpRequest);
router.post("/verify-otp", verifyOtp);

//product routes
router.post("/add-product", addProduct);
router.get("/products", getProducts);
router.get("/product/:id", getProduct);
router.put("/update-product/:id", updateProduct);
router.delete("/delete-product", deleteProduct);

//sales routes
router.post("/add-sale", addSale);
router.get("/sales", getSales);
router.get("/page-sales", getSomeSales);
router.get("/sale/:id", getSale);
router.put("/update-sale/:id", updateSale);
router.delete("/delete-sale", deleteSale);

//expenses routes
router.post("/add-expense", addExpense);
router.get("/expenses", getExpenses);
router.get("/expense", getExpense);
router.put("/update-expense", updateExpense);
router.delete("/delete-expense", deleteExpense);

//salespersons routes
router.post("/add-salesperson", addSalesperson);
router.get("/salespersons", getSalespersons);
router.get("/salesperson/:id", getSalesperson);
router.put("/update-salesperson/:id", updateSalesperson);
router.delete("/delete-salesperson", deleteSalesperson);

//logs routes
router.get("/logins", getLogins);
router.get("/logouts", getLogouts);
router.post("/logout", logout);

//cloudinary routes
router.delete("/delete-image", VerifyUser, deleteImage);

export { router as Router };
