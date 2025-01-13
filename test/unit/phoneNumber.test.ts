import { validatePhoneNumber } from "../../src/api/services/Validator";
import { describe, it, expect } from "vitest";

describe("validatePhoneNumber Function", () => {
  const phoneNumberProvider = [
    // Valid phone numbers
    { value: "12345678", expected: { isValid: true } }, // Local number
    { value: "+4512345678", expected: { isValid: true } }, // International number

    // Invalid phone numbers
    { value: "", expected: { isValid: false, message: "Phone number cannot be empty" } }, // Empty input
    { value: "1234567", expected: { isValid: false, message: "Phone number must be 8 digits or start with + followed by 10 digits" } }, // Too short
    { value: "+1234567", expected: { isValid: false, message: "Phone number must be 8 digits or start with + followed by 10 digits" } }, // Too short with +
    { value: "abcdefgh", expected: { isValid: false, message: "Phone number must be 8 digits or start with + followed by 10 digits" } }, // Non-numeric
    { value: "+451234567", expected: { isValid: false, message: "Phone number must be 8 digits or start with + followed by 10 digits" } }, // Too short with +45
    { value: "+45123456789", expected: { isValid: false, message: "Phone number must be 8 digits or start with + followed by 10 digits" } }, // Too long with +45
    { value: "1234567890", expected: { isValid: false, message: "Phone number must be 8 digits or start with + followed by 10 digits" } }, // Too long
  ];

  describe.each(phoneNumberProvider)("validatePhoneNumber tests", ({ value, expected }) => {
    it(`validatePhoneNumber(${JSON.stringify(value)}) should return ${
      expected.isValid ? "true" : `false with message "${expected.message}"`
    }`, () => {
      const result = validatePhoneNumber(value);
      expect(result.isValid).toBe(expected.isValid);

      if (!expected.isValid) {
        expect(result.message).toBe(expected.message); // Check error message for invalid cases
      }
    });
  });
  
});
