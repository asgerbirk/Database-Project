import { Request, Response } from "express";
import * as EmployeeService from "../services/EmployeeService.js";

export async function getAll(req: Request, res: Response) {
  try {
    const employees = await EmployeeService.getAll();
    res.status(201).send(employees);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const employee = await EmployeeService.getById(req.params);
    res.status(201).send({ employee });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
}

export async function Add(req: Request, res: Response) {
  try {
    const employee = await EmployeeService.Add(req.body);
    res.status(201).send({ employee });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
}

export async function Update(req: Request, res: Response) {
    try {
      const employee = await EmployeeService.Update(req.params, req.body);
      res.status(201).send({ employee });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }

export async function Delete(req: Request, res: Response) {
  try {
    await EmployeeService.Delete(req.params);
    res.status(200).send();
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
}
