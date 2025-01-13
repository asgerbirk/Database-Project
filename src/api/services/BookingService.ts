import { PrismaClient } from "@prisma/client";
import { isClassFull } from "../helpers/Validator.js";

type DatabaseStrategy = {
  getAll: () => Promise<any[] | { error: string }>;
  getById: (id: number) => Promise<any | { error: string }>;

  add: (data: any) => Promise<any | { error: string }>;
  update: (id: number, data: any) => Promise<any | { error: string }>;
  delete: (id: number) => Promise<void | { error: string }>;
};

export function canCreateBooking(existingBooking, classData, bookingCount) {
  const errors = [];

  // 1. Already booked?
  if (existingBooking) {
    errors.push("You have already booked this class");
  }

  // 2. Class not found?
  if (!classData) {
    errors.push("Class does not exist");
  } else {
    // 3. Class is full?
    if (bookingCount >= classData.MaxParticipants) {
      errors.push("Class is already full");
    }
  }

  // Return an object containing success/failure
  if (errors.length) {
    return { success: false, errors };
  }
  return { success: true };
}

export const createPrismaBookingStrategy = (): DatabaseStrategy => {
  const prisma = new PrismaClient();

  return {
    getAll: async () => {
      try {
        return await prisma.bookings.findMany({
          include: { class: true, members: true },
        });
      } catch (error) {
        console.error(error);
        return { error: "Failed to fetch bookings" };
      }
    },

    getById: async (id) => {
      try {
        const booking = await prisma.bookings.findUnique({
          where: { BookingID: id },
          include: { class: true, members: true },
        });

        if (!booking) return { error: "Booking not found" };
        return booking;
      } catch (error) {
        console.error(error);
        return { error: "Failed to fetch booking" };
      }
    },

    add: async (data) => {
      try {
        // Check if the user has already booked this class
        const existingBooking = await prisma.bookings.findFirst({
          where: {
            ClassID: data.ClassID,
            MemberID: data.MemberID,
          },
        });

        if (existingBooking) {
          return {
            success: false,
            error: "You have already booked this class",
          };
        }

        // 2. Fetch the class data to get MaxParticipants
        const classData = await prisma.classes.findUnique({
          where: {
            ClassID: data.ClassID,
          },
        });

        if (!classData) {
          return {
            success: false,
            error: "Class not found",
          };
        }

        // 3. Count the current number of bookings for this class
        const bookingCount = await prisma.bookings.count({
          where: {
            ClassID: data.ClassID,
          },
        });

        // 4. Validate if the class is full
        const validationError = isClassFull(classData, bookingCount);
        if (validationError) {
          return {
            success: false,
            error: validationError,
          };
        }

        // Create the booking
        const newBooking = await prisma.bookings.create({
          data: {
            ClassID: data.ClassID,
            BookingDate: new Date(data.BookingDate).toISOString(),
            Status: data.Status,
            MemberID: data.MemberID,
          },
        });

        // Return a consistent success object
        return { success: true, data: newBooking };
      } catch (error) {
        console.error("Error in bookingService.add:", error);
        // Return a consistent error object
        return { success: false, error: "Failed to create booking" };
      }
    },

    update: async (id, data) => {
      try {
        return await prisma.bookings.update({
          where: { BookingID: id },
          data,
        });
      } catch (error) {
        console.error(error);
        return { error: "Failed to update booking" };
      }
    },

    delete: async (id) => {
      try {
        await prisma.bookings.delete({ where: { BookingID: id } });
      } catch (error) {
        console.error(error);
        return { error: "Failed to delete booking" };
      }
    },
  };
};

// Booking Service Factory
export const createBookingService = () => {
  return createPrismaBookingStrategy();
};
