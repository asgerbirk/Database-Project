import { Request, Response } from "express";
import { createMembershipService } from "../services/MembershipService.js";

const membershipService = createMembershipService("sql");

export async function getAll(req: Request, res: Response) {
  try {
    const memberships = await membershipService.getAll();
    res.status(201).send(memberships);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const membership = await membershipService.getById(req.params);
    res.status(201).send({ membership });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
}

export async function Add(req: Request, res: Response) {
  try {
    const membership = await membershipService.add(req.body);
    if (membership.error) {
      res.status(404).send({ membership });
    } else {
      res.status(201).send({ membership });
    }
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
}

export async function Update(req: Request, res: Response) {
  try {
    const membership = await membershipService.update(req.params, req.body);
    res.status(201).send({ membership });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
}

export async function Delete(req: Request, res: Response) {
  try {
    await membershipService.delete(req.params);
    res.status(200).send();
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
}
