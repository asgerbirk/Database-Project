import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Retrieve all products
 *     description: Fetch all products from the database.
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Successfully retrieved products.
 *       500:
 *         description: Internal server error.
 */
router.get("/products", async (req: Request, res: Response) => {
  try {
    const products = await prisma.products.findMany({
      include: {
        productcategories: true,
      },
    });
    res.status(200).send(products);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to retrieve products" });
  }
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Retrieve a single product by ID
 *     description: Fetch a product by its ID.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the product to retrieve.
 *     responses:
 *       200:
 *         description: Successfully retrieved the product.
 *       404:
 *         description: Product not found.
 *       500:
 *         description: Internal server error.
 */
router.get(
  "/products/:id",
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
      const product = await prisma.products.findUnique({
        where: { ProductID: parseInt(id) },
        include: {
          productcategories: true,
        },
      });

      if (!product) {
        res.status(404).send({ error: "Product not found" });
      }

      res.status(200).send(product);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Failed to retrieve product" });
    }
  }
);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     description: Add a new product to the database.
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ProductName:
 *                 type: string
 *               Description:
 *                 type: string
 *               Price:
 *                 type: number
 *                 format: decimal
 *               StockQuantity:
 *                 type: integer
 *               CategoryID:
 *                 type: integer
 *               PaymentID:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Product created successfully.
 *       400:
 *         description: Validation error or bad request.
 *       500:
 *         description: Internal server error.
 */
router.post("/products", async (req: Request, res: Response) => {
  const {
    ProductName,
    Description,
    Price,
    StockQuantity,
    CategoryID,
    PaymentID,
  } = req.body;

  try {
    const newProduct = await prisma.products.create({
      data: {
        ProductName,
        Description,
        Price,
        StockQuantity,
        CategoryID,
        PaymentID,
      },
    });

    res.status(201).send(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to create product" });
  }
});

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update an existing product
 *     description: Modify the details of an existing product.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the product to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ProductName:
 *                 type: string
 *               Description:
 *                 type: string
 *               Price:
 *                 type: number
 *                 format: decimal
 *               StockQuantity:
 *                 type: integer
 *               CategoryID:
 *                 type: integer
 *               PaymentID:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Product updated successfully.
 *       404:
 *         description: Product not found.
 *       500:
 *         description: Internal server error.
 */
router.put(
  "/products/:id",
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const {
      ProductName,
      Description,
      Price,
      StockQuantity,
      CategoryID,
      PaymentID,
    } = req.body;

    try {
      const updatedProduct = await prisma.products.update({
        where: { ProductID: parseInt(id) },
        data: {
          ProductName,
          Description,
          Price,
          StockQuantity,
          CategoryID,
          PaymentID,
        },
      });

      res.status(200).send(updatedProduct);
    } catch (error) {
      if (error.code === "P2025") {
        res.status(404).send({ error: "Product not found" });
      }
      console.error(error);
      res.status(500).send({ error: "Failed to update product" });
    }
  }
);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     description: Remove a product from the database.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the product to delete.
 *     responses:
 *       204:
 *         description: Product deleted successfully.
 *       404:
 *         description: Product not found.
 *       500:
 *         description: Internal server error.
 */
router.delete(
  "/products/:id",
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
      await prisma.products.delete({
        where: { ProductID: parseInt(id) },
      });

      res.status(204).send();
    } catch (error) {
      if (error.code === "P2025") {
        res.status(404).send({ error: "Product not found" });
      }
      console.error(error);
      res.status(500).send({ error: "Failed to delete product" });
    }
  }
);

export { router as ProductRouter };
