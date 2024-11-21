import { Router } from "express";
import {
  register,
  login,
  refreshToken,
} from "../controllers/AuthenticationController.js";

const router = Router();

router.post("/register", register);

router.post("/login", login);

router.post("/refreshToken", refreshToken);

export default router;
