import { PrismaClient } from "@prisma/client";
import {DateTime} from "neo4j-driver";

// Type definitions
type DatabaseStrategy = {
    getAll: () => Promise<any[] | { error: string }>;
    getById: (id: number) => Promise<any | { error: string }>;
    create: (data: any) => Promise<any | { error: string }>;
    update: (id: number, data: any) => Promise<any | { error: string }>;
    delete: (id: number) => Promise<any | { error: string }>;
};

// Prisma Database Strategy for "classes"
const createPrismaClassStrategy = (): DatabaseStrategy => {
    const prisma = new PrismaClient();

    return {
        // Get all classes
        getAll: async () => {
            try {
                return await prisma.classes.findMany({
                    include: {
                        bookings: true,
                        center: true,
                        employee: true,
                    },
                });
            } catch (error) {
                console.error("Error fetching classes:", error);
                return { error: "Failed to retrieve classes" };
            }
        },

        // Get a class by ID
        getById: async (id: number) => {
            try {
                const classData = await prisma.classes.findUnique({
                    where: { ClassID: id },
                    include: {
                        bookings: true,
                        center: true,
                        employee: true,
                    },
                });

                if (!classData) return { error: "Class not found" };
                return classData;
            } catch (error) {
                console.error("Error fetching class by ID:", error);
                return { error: "Failed to retrieve class" };
            }
        },

        // Create a new class
        create: async (data: any) => {
            try {
                console.log(data);

                // Validate required fields
                if (!data.ScheduleDate || !data.StartTime || !data.EndTime) {
                    throw new Error("Missing required date or time information");
                }

                // Combine date and time safely
                const startTime = new Date(`${data.ScheduleDate}T${data.StartTime}`);
                const endTime = new Date(`${data.ScheduleDate}T${data.EndTime}`);

                // Validate times
                if (startTime >= endTime) {
                    throw new Error("Start time must be before end time");
                }

                const newClass = await prisma.classes.create({
                    data: {
                        ClassName: data.ClassName,
                        Description: data.Description,
                        ClassType: data.ClassType,
                        Duration: data.Duration,
                        MaxParticipants: data.MaxParticipants,
                        EmployeeID: data.EmployeeID,
                        CenterID: data.CenterID,
                        ScheduleDate: new Date(data.ScheduleDate),
                        StartTime: startTime,
                        EndTime: endTime,
                    },
                });
                return newClass;
            } catch (error) {
                console.error("Error creating class:", error);
                throw error; // Re-throw to allow caller to handle specific errors
            }
        },

        // Update an existing class
        update: async (id: number, data: any) => {
            try {
                // Validate required fields
                if (!data.ScheduleDate || !data.StartTime || !data.EndTime) {
                    throw new Error("Missing required date or time information");
                }

                // Combine date and time safely
                const startTime = new Date(`${data.ScheduleDate}T${data.StartTime}`);
                const endTime = new Date(`${data.ScheduleDate}T${data.EndTime}`);

                // Validate times
                if (startTime >= endTime) {
                    throw new Error("Start time must be before end time");
                }
                const updatedClass = await prisma.classes.update({
                    where: { ClassID: id },
                    data: {
                        ClassName: data.ClassName,
                        Description: data.Description,
                        ClassType: data.ClassType,
                        Duration: data.Duration,
                        MaxParticipants: data.MaxParticipants,
                        EmployeeID: data.EmployeeID,
                        CenterID: data.CenterID,
                        ScheduleDate: new Date(data.ScheduleDate),
                        StartTime: startTime,
                        EndTime: endTime,
                    },
                });
                return updatedClass;
            } catch (error) {
                console.error("Error updating class:", error);
                return { error: "Failed to update class" };
            }
        },

        // Delete a class
        delete: async (id: number) => {
            try {
                await prisma.classes.delete({
                    where: { ClassID: id },
                });
                return { message: "Class deleted successfully" };
            } catch (error) {
                console.error("Error deleting class:", error);
                return { error: "Failed to delete class" };
            }
        },
    };
};

// Export the service for "classes"
export const createClassService = () => {
    const strategy = createPrismaClassStrategy();

    return {
        getAll: () => strategy.getAll(),
        getById: (id: number) => strategy.getById(id),
        create: (data: any) => strategy.create(data),
        update: (id: number, data: any) => strategy.update(id, data),
        delete: (id: number) => strategy.delete(id),
    };
};
