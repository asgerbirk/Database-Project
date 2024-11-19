import { Request, Response } from "express";
import * as AuthenticationService from "../services/AuthenticationService.js";

export async function register(req: Request, res: Response) {
  try {
    const user = await AuthenticationService.register(req.body);
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const token = await AuthenticationService.login(req.body);
    res.status(201).send({ token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
}

export async function refreshToken(req: Request, res: Response) {
  try {
    const newToken = await AuthenticationService.refreshToken(req.body);
    res.status(201).send({ newToken });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
}
