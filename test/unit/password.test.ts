import { validateZodPassword } from "../../src/api/helpers/Validator";
import { describe, expect, it } from "vitest";

describe("validatePassword Function", () => {
  const passwordProvider = [
    // Valid passwords
    { value: "Password123.", expected: { isValid: true } },
    { value: "Password1234!", expected: { isValid: true } },
    { value: "Password12345/", expected: { isValid: true } },
    { value: "P@ssw0rdGood!", expected: { isValid: true } },

    // Invalid passwords
    { value: "password123", expected: { isValid: false, message: "Password must have at least one uppercase letter" } }, // No uppercase
    { value: "PASSWORD123", expected: { isValid: false, message: "Password must have at least one lowercase letter" } }, // No lowercase
    { value: "password", expected: { isValid: false, message: "Password must have at least one uppercase letter" } }, // Only lowercase
    { value: "PASSWORD", expected: { isValid: false, message: "Password must have at least one lowercase letter" } }, // Only uppercase
    { value: "123456", expected: { isValid: false, message: "Password must be at least 8 characters long" } }, // Only numbers
    { value: "", expected: { isValid: false, message: "Password must be at least 8 characters long" } }, // Empty string
    { value: "P@ss1", expected: { isValid: false, message: "Password must be at least 8 characters long" } }, // Too short
    { value: "P@ssw0rdWayTooLong123!", expected: { isValid: false, message: "Password cannot be longer than 20 characters" } }, // Too long
  ];

  describe.each(passwordProvider)("validatePassword tests", ({ value, expected }) => {
    it(`validatePassword(${JSON.stringify(value)}) should return ${
      expected.isValid ? "true" : `false with message "${expected.message}"`
    }`, () => {
      const result = validateZodPassword(value);
      expect(result.isValid).toBe(expected.isValid);

      if (!expected.isValid) {
        expect(result.message).toBe(expected.message); // Check error message for invalid cases
      }
    });
  });
});