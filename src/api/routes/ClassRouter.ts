import express from "express";
import {
    getAll,
    getById,
    Add,
    Update,
    Delete,
} from "../controllers/ClassController.js";

const router = express.Router();

/**
 * @swagger
 * /classes:
 *   get:
 *     summary: Retrieve a list of classes
 *     description: Fetches all classes from the database, including related details.
 *     tags: [Classes]
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of classes.
 *       500:
 *         description: Internal server error occurred.
 */
router.get("/classes", getAll);

/**
 * @swagger
 * /classes/{id}:
 *   get:
 *     summary: Retrieve a specific class
 *     description: Fetches a class by its unique ID.
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the class to retrieve.
 *     responses:
 *       200:
 *         description: Successfully retrieved the class.
 *       404:
 *         description: Class not found.
 *       500:
 *         description: Internal server error occurred.
 */
router.get("/classes/:id", getById);

/**
 * @swagger
 * /classes:
 *   post:
 *     summary: Create a new class
 *     description: Adds a new class to the database with specified details.
 *     tags: [Classes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ClassName:
 *                 type: string
 *               Description:
 *                 type: string
 *               ClassType:
 *                 type: string
 *               Duration:
 *                 type: integer
 *               MaxParticipants:
 *                 type: integer
 *               EmployeeID:
 *                 type: integer
 *               CenterID:
 *                 type: integer
 *               ScheduleDate:
 *                 type: string
 *                 format: date
 *               StartTime:
 *                 type: string
 *                 format: time
 *               EndTime:
 *                 type: string
 *                 format: time
 *     responses:
 *       201:
 *         description: Class successfully created.
 *       400:
 *         description: Validation error or bad request.
 *       500:
 *         description: Internal server error occurred.
 */
router.post("/classes", Add);

/**
 * @swagger
 * /classes/{id}:
 *   put:
 *     summary: Update an existing class
 *     description: Updates the details of an existing class by ID.
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the class to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ClassName:
 *                 type: string
 *               Description:
 *                 type: string
 *               ClassType:
 *                 type: string
 *               Duration:
 *                 type: integer
 *               MaxParticipants:
 *                 type: integer
 *               EmployeeID:
 *                 type: integer
 *               CenterID:
 *                 type: integer
 *               ScheduleDate:
 *                 type: string
 *                 format: date
 *               StartTime:
 *                 type: string
 *                 format: time
 *               EndTime:
 *                 type: string
 *                 format: time
 *     responses:
 *       200:
 *         description: Class successfully updated.
 *       404:
 *         description: Class not found.
 *       500:
 *         description: Internal server error occurred.
 */
router.put("/classes/:id", Update);

/**
 * @swagger
 * /classes/{id}:
 *   delete:
 *     summary: Delete a class
 *     description: Removes a class from the database by its unique ID.
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the class to delete.
 *     responses:
 *       204:
 *         description: Class successfully deleted.
 *       404:
 *         description: Class not found.
 *       500:
 *         description: Internal server error occurred.
 */
router.delete("/classes/:id", Delete);

export { router as ClassesRouter };
