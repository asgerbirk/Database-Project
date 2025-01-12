import { PrismaClient } from "@prisma/client";

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
        // a) Check if the user already booked the class
        const existingBooking = await prisma.bookings.findFirst({
          where: {
            ClassID: data.ClassID,
            MemberID: data.MemberID,
          },
        });

        // b) Fetch the class record to see if it exists + get MaxParticipants
        const classData = await prisma.classes.findUnique({
          where: { ClassID: data.ClassID },
        });

        // c) Count how many users already booked this class
        const bookingCount = await prisma.bookings.count({
          where: { ClassID: data.ClassID },
        });

        const checkResult = canCreateBooking(
          existingBooking,
          classData,
          bookingCount
        );

        if (!checkResult.success) {
          return {
            success: false,
            error: checkResult.errors.join(", "), // combine errors into one string
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
