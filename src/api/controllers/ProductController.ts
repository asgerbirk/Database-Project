import { Request, Response } from "express";
import { createProductService } from "../services/ProductService.js";

const productService = createProductService("sql");

export async function getAll(req: Request, res: Response) {
  try {
    const products = await productService.getAll(); // Added await
    res.status(200).send(products); // Changed to 200 for successful retrieval
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const product = await productService.getById(req.params); // Added await
    res.status(200).send({ product }); // Changed to 200
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
}

export async function add(req: Request, res: Response) {
  // Changed to camelCase
  try {
    const product = await productService.add(req.body); // Changed method name
    res.status(201).send({ product });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
}

export async function update(req: Request, res: Response) {
  // Changed to camelCase
  try {
    const product = await productService.update(req.body, req.params); // Changed method name
    res.status(200).send({ product }); // Changed to 200
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
}

export async function remove(req: Request, res: Response) {
  // Renamed to remove, changed to camelCase
  try {
    await productService.delete(req.params); // Changed method name
    res.status(200).send();
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
}
