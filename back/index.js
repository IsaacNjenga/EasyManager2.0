import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./config/db.js";
import { Router } from "./routes/routes.js";

dotenv.config();
const app = express();

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (
      ["http://localhost:3000", "https://easymanager-gilt.vercel.app"].includes(origin)
    ) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};


app.use(cors(corsOptions));
//middleware to parse json bodies from the front end
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/EasyManager", Router);

app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    return res.sendStatus(200);
  }
  next();
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Connected on port: ${PORT}`);
});
