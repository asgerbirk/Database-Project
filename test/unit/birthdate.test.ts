import { validateDateOfBirth } from "../../src/api/helpers/Validator";
import { describe, expect, it } from "vitest";

describe("validateDateOfBirth function", () => {
  const today = new Date();

const formattedDate = (date: Date) =>
  `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;

describe("validateDateOfBirth Function", () => {
  const dateProvider = [
    // Valid dates
    { value: "01-01-2000", expected: { isValid: true } }, // Normal valid date
    { value: "15-05-1980", expected: { isValid: true } }, // Valid date, within range
    { value: "10-10-1925", expected: { isValid: true } }, // Exactly 100 years old
    {
      value: formattedDate(new Date(today.getFullYear() - 16, today.getMonth(), today.getDate())),
      expected: { isValid: true },
    }, // Exactly 16 years old
    {
      value: formattedDate(new Date(today.getFullYear() - 100, today.getMonth(), today.getDate())),
      expected: { isValid: true },
    }, // Exactly 100 years old

    // Invalid dates
    { value: "", expected: { isValid: false, message: "Date of birth cannot be empty" } }, // Empty input
    { value: " ", expected: { isValid: false, message: "Date of birth cannot be empty" } }, // Only whitespace
    { value: "32-01-2000", expected: { isValid: false, message: "Date is not a valid calendar date" } }, // Invalid day
    { value: "10-13-2000", expected: { isValid: false, message: "Date is not a valid calendar date" } }, // Invalid month
    { value: "01-01-2026", expected: { isValid: false, message: "Date cannot be in the future" } }, // Future date
    { value: "01-01-2010", expected: { isValid: false, message: "Age must be at least 16 years" } }, // Too young
    { value: "01-03-1905", expected: { isValid: false, message: "Age cannot exceed 100 years" } }, // Too old
    { value: "01/01/2000", expected: { isValid: false, message: "Date must be in dd-mm-yyyy format" } }, // Wrong format
    { value: "2000-01-01", expected: { isValid: false, message: "Date must be in dd-mm-yyyy format" } }, // Wrong format
    { value: "abcd-ef-ghij", expected: { isValid: false, message: "Date must be in dd-mm-yyyy format" } }, // Non-numeric input
  ];

  describe.each(dateProvider)("validateDateOfBirth tests", ({ value, expected }) => {
    it(`validateDateOfBirth(${JSON.stringify(value)}) should return ${
      expected.isValid ? "true" : `false with message "${expected.message}"`
    }`, () => {
      const result = validateDateOfBirth(value);
      expect(result.isValid).toBe(expected.isValid);
  
      if (!expected.isValid) {
        expect(result.message).toBe(expected.message); // Check error message for invalid cases
      }
    });
  });
});
});