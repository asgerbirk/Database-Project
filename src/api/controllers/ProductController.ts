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
    if (product.error) {
      res.status(404).send({product})
    }
    else {
      res.status(200).send({product});
    }
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
}

export async function add(req: Request, res: Response) {
  try {
    const product = await productService.add(req.body);
    if (product.error) {
      res.status(404).send({product})
    } else {
      res.status(201).send({product});
    }
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const product = await productService.update(req.params, req.body); // Changed method name
    if (product.error) {
      res.status(404).send({product})
    } else {
      res.status(200).send({product});
    }
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const serviceRes = await productService.delete(req.params); // Changed method name
    console.log(serviceRes);
    if (serviceRes) {
      res.status(404).send(serviceRes)
    } else {
      res.status(200).send(serviceRes);
    }
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
}
