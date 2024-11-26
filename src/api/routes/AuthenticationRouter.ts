import { Router } from "express";
import {
  register,
  login,
  refreshToken,
} from "../controllers/AuthenticationController.js";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();
router.post("/register", upload.single("image"), register);

router.post("/login", login);

router.post("/refreshToken", refreshToken);

export default router;
