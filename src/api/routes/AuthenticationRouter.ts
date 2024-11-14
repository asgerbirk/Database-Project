import express, { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { User } from "../../types/User.js";

const router = express.Router();

const prisma = new PrismaClient();

router.post("/users", async (req: Request, res: Response) => {});
