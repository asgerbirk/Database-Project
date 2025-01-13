import { validateZodPassword } from "../../src/api/helpers/Validator";
import { describe, expect, it } from "vitest";

describe("validatePassword function", () => {
  const validPasswords = [
    "Password123.",
    "Password1234!",
    "Password12345/",
    "P@ssw0rdGood!",
  ];

  const invalidPasswords = [
    "password123", // No uppercase
    "PASSWORD123", // No lowercase
    "password", // Only lowercase
    "PASSWORD", // Only uppercase
    "123456", // Only numbers
    "", // Empty string
    "P@ss1", // Too short
    "P@ssw0rdWayTooLong123!", // Too long
  ];

  it("should return true for valid passwords", () => {
    for (const password of validPasswords) {
      const result = validateZodPassword(password);
      expect(result.isValid).toBe(true);
    }
  });

  it("should return false for invalid passwords", () => {
    for (const password of invalidPasswords) {
      const result = validateZodPassword(password);
      expect(result.isValid).toBe(false);
      expect(result.message).toBeDefined();
    }
  });
});
