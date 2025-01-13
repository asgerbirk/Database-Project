import express from "express";
import { Add, Delete, getAll, getById, Update } from "../controllers/MembershipController.js";

const router = express.Router();
/**
 * @swagger
 * /memberships:
 *   get:
 *     summary: Retrieve all memberships
 *     description: Fetch all memberships from the database.
 *     tags: [Memberships]
 *     responses:
 *       200:
 *         description: Successfully retrieved memberships.
 *       500:
 *         description: Internal server error.
 */
router.get("/memberships", getAll);

/**
 * @swagger
 * /memberships/{id}:
 *   get:
 *     summary: Retrieve a single membership by ID
 *     description: Fetch a membership by its ID.
 *     tags: [Memberships]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the membership to retrieve.
 *     responses:
 *       200:
 *         description: Successfully retrieved the membership.
 *       404:
 *         description: Membership not found.
 *       500:
 *         description: Internal server error.
 */
router.get(
  "/memberships/:id",
  getById);

/**
 * @swagger
 * /memberships:
 *   post:
 *     summary: Create a new membership
 *     description: Add a new membership to the database.
 *     tags: [Memberships]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               MembershipName:
 *                 type: string
 *               PricePerMonth:
 *                 type: number
 *                 format: decimal
 *               AccessLevel:
 *                 type: string
 *               Duration:
 *                 type: string
 *               MaxClassBookings:
 *                 type: integer
 *               Description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Membership created successfully.
 *       400:
 *         description: Validation error or bad request.
 *       500:
 *         description: Internal server error.
 */
router.post("/memberships", Add);

/**
 * @swagger
 * /memberships/{id}:
 *   put:
 *     summary: Update an existing membership
 *     description: Modify the details of an existing membership.
 *     tags: [Memberships]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the membership to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               MembershipName:
 *                 type: string
 *               PricePerMonth:
 *                 type: number
 *                 format: decimal
 *               AccessLevel:
 *                 type: string
 *               Duration:
 *                 type: string
 *               MaxClassBookings:
 *                 type: integer
 *               Description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Membership updated successfully.
 *       404:
 *         description: Membership not found.
 *       500:
 *         description: Internal server error.
 */
router.put(
  "/memberships/:id",
  Update);

/**
 * @swagger
 * /memberships/{id}:
 *   delete:
 *     summary: Delete a membership
 *     description: Remove a membership from the database.
 *     tags: [Memberships]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the membership to delete.
 *     responses:
 *       204:
 *         description: Membership deleted successfully.
 *       404:
 *         description: Membership not found.
 *       500:
 *         description: Internal server error.
 */
router.delete(
  "/memberships/:id",
  Delete);

export { router as MembershipRouter };
