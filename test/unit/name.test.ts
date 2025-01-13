import { validateZodName } from "../../src/api/services/Validator";
import { describe, it, expect } from "vitest";

describe("validateName Function", () => {
  const nameProvider = [
    // Valid names
    { value: "John", expected: { isValid: true } },
    { value: "Jane", expected: { isValid: true } },
    { value: "John Doe", expected: { isValid: true } },
    { value: "Jane Doe", expected: { isValid: true } },
    { value: "Jean-Paul", expected: { isValid: true } }, // Name with hyphen
    { value: "Mary Jane Watson", expected: { isValid: true } }, // Multi-part name

    // Invalid names
    { value: "", expected: { isValid: false, message: "Name must be at least 2 characters long." } }, // Empty string
    { value: " ", expected: { isValid: false, message: "Name must be at least 2 characters long." } }, // Whitespace only
    { value: "J", expected: { isValid: false, message: "Name must be at least 2 characters long." } }, // Too short
    { value: "A".repeat(51), expected: { isValid: false, message: "Name cannot be longer than 50 characters." } }, // Too long
    { value: "John1", expected: { isValid: false, message: "Name can only contain letters, spaces, and hyphens." } }, // Name with numbers
    { value: "John Doe1", expected: { isValid: false, message: "Name can only contain letters, spaces, and hyphens." } }, // Name with numbers in surname
    { value: "John1 Doe", expected: { isValid: false, message: "Name can only contain letters, spaces, and hyphens." } }, // Number in first name
    { value: "John-Doe1", expected: { isValid: false, message: "Name can only contain letters, spaces, and hyphens." } }, // Hyphen followed by number
    { value: "J@ne", expected: { isValid: false, message: "Name can only contain letters, spaces, and hyphens." } }, // Special character
  ];

  describe.each(nameProvider)("validateName tests", ({ value, expected }) => {
    it(`validateName(${JSON.stringify(value)}) should return ${
      expected.isValid ? "true" : `false with message "${expected.message}"`
    }`, () => {
      const result = validateZodName(value);
      expect(result.isValid).toBe(expected.isValid);

      if (!expected.isValid) {
        expect(result.message).toBe(expected.message); // Check error message for invalid cases
      }
    });
  });
});
