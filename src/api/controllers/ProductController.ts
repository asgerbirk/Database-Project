import { Request, Response } from "express";
import * as ProductService from "../services/ProductService.js";

export async function getAll(req: Request, res: Response) {
  try {
    const products = await ProductService.getAll();
    res.status(201).send(products);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const product = await ProductService.getById(req.params);
    res.status(201).send({ product });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
}

export async function Add(req: Request, res: Response) {
  try {
    const product = await ProductService.Add(req.body);
    res.status(201).send({ product });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
}

export async function Update(req: Request, res: Response) {
    try {
      const product = await ProductService.Update(req.params, req.body);
      res.status(201).send({ product });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }

export async function Delete(req: Request, res: Response) {
  try {
    await ProductService.Delete(req.params);
    res.status(200).send();
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
}
