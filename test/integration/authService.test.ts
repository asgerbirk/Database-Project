import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";
import * as AuthenticationService from "../../src/api/services/AuthenticationService.js";

const prisma = new PrismaClient();

describe("User Creation Integration Tests", () => {
  beforeAll(async () => {
    // Set up test data: Add a test membership
    await prisma.memberships.create({
      data: {
        MembershipID: 999,
        MembershipName: "TEST-Membership",
        Description: "This is a test membership",
        PricePerMonth: 50,
      },
    });
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.person.deleteMany({
      where: {
        Email: {
          startsWith: "test-",
        },
      },
    });

    await prisma.memberships.deleteMany({
      where: {
        MembershipName: "TEST-Membership",
      },
    });

    await prisma.$disconnect();
  });

  it("should create a new user with an associated member record", async () => {
    const testData = {
      email: "test-user999@example.com",
      password: "Hashedpassword123&",
      firstName: "John",
      lastName: "Doe",
      phone: "20202020",
      address: "123 Test St",
      dateOfBirth: "01/01/1990",
      membershipId: 999,
      emergencyContact: "Jane Doe",
      imageUrl: "http://example.com/image.jpg",
    };

    const newUser = await AuthenticationService.register(testData, null);

    // Assertions
    expect(newUser).toBeDefined();
    expect(newUser.Email).toBe(testData.email);
    expect(newUser.Role).toBe("MEMBER");
    expect(newUser.member).toBeDefined();
    expect(newUser.member.MembershipID).toBe(testData.membershipId);
    expect(newUser.member.EmergencyContact).toBe(testData.emergencyContact);
  });

  it("should fail when required fields are missing", async () => {
    const invalidData = {
      email: null, // Missing email
      password: "hashedpassword123",
      membershipId: 999,
    };

    await expect(
      AuthenticationService.register(invalidData, null)
    ).rejects.toThrowError("Email cannot be empty");
  });
});
