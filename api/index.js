import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();

import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
app.use(express.json());

app.use(cookieParser());

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
// app.use(cors());
app.use(express.json());
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

//Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173"); // Change * to specific origin in production
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization,Access-Control-Allow-Methods,Access-Control-Allow-Credentials",
    "Access-Control-Allow-Origin"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});
