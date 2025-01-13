import { validateEmail } from "../../src/api/helpers/Validator";
import { describe, expect, it } from "vitest";

describe("validateEmail Function", () => {
  const emailProvider = [
    // Valid emails
    { value: "validemail@example.dk", expected: { isValid: true } },
    { value: "user.name+tag@domain.com", expected: { isValid: true } },
    { value: "email@sub.domain.co", expected: { isValid: true } },

    // Invalid emails
    { value: "", expected: { isValid: false, message: "Email cannot be empty" } }, // Empty string
    { value: "plainaddress", expected: { isValid: false, message: "Invalid email format" } }, // Missing @ and domain
    { value: "@missingusername.com", expected: { isValid: false, message: "Invalid email format" } }, // Missing username
    { value: "missingdomain@.com", expected: { isValid: false, message: "Invalid email format" } }, // Missing domain
    { value: "missingatdomain.com", expected: { isValid: false, message: "Invalid email format" } }, // Missing @
    { value: "email@.domain.com", expected: { isValid: false, message: "Invalid email format" } }, // Dot after @
    { value: "email@domain..com", expected: { isValid: false, message: "Invalid email format" } }, // Double dots
    { value: "email@domain_com", expected: { isValid: false, message: "Invalid email format" } }, // Underscore in domain
    { value: "email@-domain.com", expected: { isValid: false, message: "Invalid email format" } }, // Hyphen in domain
  ];

  describe.each(emailProvider)("validateEmail tests", ({ value, expected }) => {
    it(`validateEmail(${JSON.stringify(value)}) should return ${
      expected.isValid ? "true" : "false"
    }`, () => {
      const result = validateEmail(value);
      expect(result.isValid).toBe(expected.isValid);

      if (!expected.isValid) {
        expect(result.message).toBe(expected.message); // Check error message for invalid cases
      }
    });
  });
});
