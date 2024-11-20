import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

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
router.get("/memberships", async (req: Request, res: Response) => {
  try {
    const memberships = await prisma.memberships.findMany({});
    res.send(memberships);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to retrieve memberships" });
  }
});

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
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
      const membership = await prisma.memberships.findUnique({
        where: { MembershipID: parseInt(id) },
      });

      if (!membership) {
        res.status(404).send({ error: "Membership not found" });
      }

      res.status(200).send(membership);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Failed to retrieve membership" });
    }
  }
);

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
router.post("/memberships", async (req: Request, res: Response) => {
  const {
    MembershipName,
    PricePerMonth,
    AccessLevel,
    Duration,
    MaxClassBookings,
    Description,
  } = req.body;

  try {
    const newMembership = await prisma.memberships.create({
      data: {
        MembershipName,
        PricePerMonth,
        AccessLevel,
        Duration,
        MaxClassBookings,
        Description,
      },
    });

    res.status(201).send(newMembership);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to create membership" });
  }
});

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
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const {
      MembershipName,
      PricePerMonth,
      AccessLevel,
      Duration,
      MaxClassBookings,
      Description,
    } = req.body;

    try {
      const updatedMembership = await prisma.memberships.update({
        where: { MembershipID: parseInt(id) },
        data: {
          MembershipName,
          PricePerMonth,
          AccessLevel,
          Duration,
          MaxClassBookings,
          Description,
        },
      });

      res.status(200).send(updatedMembership);
    } catch (error) {
      if (error.code === "P2025") {
        res.status(404).send({ error: "Membership not found" });
      }
      console.error(error);
      res.status(500).send({ error: "Failed to update membership" });
    }
  }
);

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
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
      await prisma.memberships.delete({
        where: { MembershipID: parseInt(id) },
      });

      res.status(204).send();
    } catch (error) {
      if (error.code === "P2025") {
        res.status(404).send({ error: "Membership not found" });
      }
      console.error(error);
      res.status(500).send({ error: "Failed to delete membership" });
    }
  }
);

export { router as MembershipRouter };
