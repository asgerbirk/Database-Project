import express from "express";
import {getAll, getById} from "../controllers/MemberController.js";

const router = express.Router();

router.get("/members", getAll)

router.get("/members/:id", getById)

export { router as MemberRouter };