import express from "express";
import {
  registerUser,
  loginUser,
  getUser
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/user", getUser);

export default router;
