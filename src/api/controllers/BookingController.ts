import { Request, Response } from "express";
import { createBookingService } from "../services/BookingService.js";

const bookingService = createBookingService();

export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await bookingService.getAll();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve bookings" });
  }
};

export const getBookingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const booking = await bookingService.getById(Number(id));
    if ("error" in booking) {
      res.status(404).json({ error: booking.error });
    } else {
      res.status(201).json(booking);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve booking" });
  }
};

export const addBooking = async (req: Request, res: Response) => {
  try {
    const result = await bookingService.add(req.body);
    if ("error" in result) {
      res.status(404).json({ error: result.error });
    }
    res.status(201).json(result.data);
  } catch (error) {
    console.error("Error in addBooking controller:", error);
    res.status(500).json({ error: "Failed to create booking" });
  }
};

export const updateBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const booking = await bookingService.update(Number(id), req.body);
    res.status(200).json(booking);
  } catch (error) {
    res.status(400).json({ error: "Failed to update booking" });
  }
};

export const deleteBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await bookingService.delete(Number(id));
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete booking" });
  }
};
