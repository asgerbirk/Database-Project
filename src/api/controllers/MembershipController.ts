import { Request, Response } from "express";
import * as MembershipService from "../services/MembershipService.js";

export async function getAll(req: Request, res: Response) {
  try {
    const memberships = await MembershipService.getAll();
    res.status(201).send(memberships);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const membership = await MembershipService.getById(req.params);
    res.status(201).send({ membership });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
}

export async function Add(req: Request, res: Response) {
  try {
    const membership = await MembershipService.Add(req.body);
    res.status(201).send({ membership });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
}

export async function Update(req: Request, res: Response) {
    try {
      const membership = await MembershipService.Update(req.params, req.body);
      res.status(201).send({ membership });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }

export async function Delete(req: Request, res: Response) {
  try {
    await MembershipService.Delete(req.params);
    res.status(200).send();
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
}
