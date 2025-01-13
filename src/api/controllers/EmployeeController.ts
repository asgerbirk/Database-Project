import { Request, Response } from "express";
import { createEmployeeService } from "../services/EmployeeService.js";


const employeeService = createEmployeeService()

export async function getAll(req: Request, res: Response) {
  try {
    const employees = await employeeService.getAll();
    res.status(201).send(employees);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const employee = await employeeService.getById(req.params);
    res.status(201).send({ employee });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
}

export async function Add(req: Request, res: Response) {
  try {
    const employee = await employeeService.add(req.body);
    res.status(201).send({ employee });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
}

export async function Update(req: Request, res: Response) {
    try {
      const employee = await employeeService.update(req.params, req.body);
      res.status(201).send({ employee });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }

export async function Delete(req: Request, res: Response) {
  try {
    await employeeService.delete(req.params);
    res.status(200).send();
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
}
