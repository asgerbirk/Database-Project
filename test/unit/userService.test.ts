import { describe, it, expect, beforeEach, vi } from "vitest";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import * as AuthenticationService from "../../src/api/services/AuthenticationService";

// Mock PrismaClient
vi.mock("@prisma/client", () => ({
    PrismaClient: vi.fn(() => ({
        person: {
            findUnique: vi.fn(),
            create: vi.fn(),
        },
    })),
}));

const mockPrisma = new PrismaClient();
// const mockS3Client = new S3Client();

// Set lower SALT_ROUNDS for tests
process.env.SALT_ROUNDS = "1";

describe("register function", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should create a new user when data is valid and email is not taken", async () => {
        mockPrisma.person.findUnique.mockResolvedValue(null);

        // Mocking S3 to simulate file upload
        // mockS3Client.send.mockResolvedValue({});

        const mockUser = {
            Email: "test@test.com",
            Password: "password123",
            FirstName: "John",
            LastName: "Doe",
            member: { MembershipID: 999, JoinDate: new Date() },
        };
        mockPrisma.person.create.mockResolvedValue(mockUser);

        // const file = {
        //     originalname: "profile.jpg",
        //     buffer: Buffer.from("mockImageBuffer"),
        //     mimetype: "image/jpeg",
        // } as Express.Multer.File;

        const data = {
            email: "test@test.com",
            password: "password123",
            firstName: "John",
            lastName: "Doe",
            membershipId: "999",
        };

        const result = await AuthenticationService.register(data);
        // Validate user creation
        expect(result).toEqual(mockUser);
        expect(mockPrisma.person.findUnique).toHaveBeenCalledWith({
            where: { Email: data.email },
        });

        // Validate password hashing
        const isPasswordValid = await bcrypt.compare(
            data.password,
            mockUser.Password
        );
        expect(isPasswordValid).toBe(true);

        // expect(mockS3Client.send).toHaveBeenCalledWith(expect.any(PutObjectCommand));
        expect(mockPrisma.person.create).toHaveBeenCalled();
    });

    it("should throw an error if the email is already taken", async () => {
        mockPrisma.person.findUnique.mockResolvedValue({ Email: "test@test.com" });

        const data = {
            email: "test@test.com",
            password: "password123",
            firstName: "John",
            lastName: "Doe",
            membershipId: "999",
        };

        await expect(AuthenticationService.register(data)).rejects.toThrow("Email is already taken");
        expect(mockPrisma.person.findUnique).toHaveBeenCalledWith({
            where: { Email: data.email },
        });
        expect(mockPrisma.person.create).not.toHaveBeenCalled();
    });
});
