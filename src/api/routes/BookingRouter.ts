import express, { Router } from "express";
import {
    getAllBookings,
    getBookingById,
    addBooking,
    updateBooking,
    deleteBooking,
} from "../controllers/BookingController.js";

const router: Router = express.Router();

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Retrieve all bookings
 *     description: Fetches all bookings with associated classes and members.
 *     tags: [Bookings]
 *     responses:
 *       200:
 *         description: Successfully retrieved bookings.
 *       500:
 *         description: Internal server error occurred.
 */
router.get("/bookings", getAllBookings);

/**
 * @swagger
 * /bookings/{id}:
 *   get:
 *     summary: Retrieve a specific booking
 *     description: Fetches a booking by its ID.
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the booking.
 *     responses:
 *       200:
 *         description: Successfully retrieved the booking.
 *       404:
 *         description: Booking not found.
 *       500:
 *         description: Internal server error occurred.
 */
router.get("/bookings/:id", getBookingById);

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Create a new booking
 *     description: Adds a new booking to the system.
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ClassID:
 *                 type: integer
 *               BookingDate:
 *                 type: string
 *                 format: date
 *               Status:
 *                 type: string
 *               MemberID:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Booking created successfully.
 *       400:
 *          description: You have already booked this class.
 *       500:
 *         description: Failed to create booking.
 */
router.post("/bookings", addBooking);

/**
 * @swagger
 * /bookings/{id}:
 *   put:
 *     summary: Update an existing booking
 *     description: Updates booking details by ID.
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the booking to update.
 *     responses:
 *       200:
 *         description: Booking updated successfully.
 *       400:
 *         description: Validation error or bad request.
 *       404:
 *         description: Booking not found.
 */
router.put("/bookings/:id", updateBooking);

/**
 * @swagger
 * /bookings/{id}:
 *   delete:
 *     summary: Delete a booking
 *     description: Removes a booking by ID.
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the booking to delete.
 *     responses:
 *       204:
 *         description: Booking deleted successfully.
 *       404:
 *         description: Booking not found.
 */
router.delete("/bookings/:id", deleteBooking);

export { router as BookingRouter };
