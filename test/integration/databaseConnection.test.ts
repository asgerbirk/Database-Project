import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Database Connection Test", () => {
    // Connect to the database before tests run
    beforeAll(async () => {
        await prisma.$connect();
    });

    // Disconnect from the database after tests complete
    afterAll(async () => {
        await prisma.$disconnect();
    });

    it("should connect to the database and perform a simple query", async () => {
        try {
            const result = await prisma.$queryRaw`SELECT 1`;
            expect(result).toBeDefined();
            console.log("Database connection successful!");
        } catch (error) {
            console.error("Database connection failed:", error.message);
            throw error;
        }
    });
})