import express, { Request, Response } from "express";
import { Add, Delete, getAll, getById, Update } from "../controllers/ProductController.js";

const router = express.Router();

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
router.get("/products", getAll);

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
 getById);

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
 *     responses:
 *       201:
 *         description: Product created successfully.
 *       400:
 *         description: Validation error or bad request.
 *       500:
 *         description: Internal server error.
 */
router.post("/products", Add);

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
  Update);

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
  Delete);

export { router as ProductRouter };
