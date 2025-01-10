import { validateLastName } from "../../src/api/services/Validator";
import { describe, expect, it } from "vitest";

describe("validateLastName function", () => {
  const validNames = ["Smith", "Doe", "Smith-Jones", "van der Laan"];
  const invalidNames = ["", " ", "Smith1", "Doe@", "Smith1 Doe", "John-Doe1"];

  it("should return true for valid last names", () => {
    for (const name of validNames) {
      const result = validateLastName(name);
      expect(result.isValid).toBe(true); // Tjekker kun isValid
    }
  });

  it("should return false for invalid last names", () => {
    for (const name of invalidNames) {
      const result = validateLastName(name);
      expect(result.isValid).toBe(false); // Tjekker kun isValid
      expect(result.message).toBeDefined(); // Sikrer at der er en fejlbesked
    }
  });

  it("should return false for empty names", () => {
    const name = "";
    const result = validateLastName(name);
    expect(result.isValid).toBe(false);
    expect(result.message).toBe("Last name cannot be empty"); // Tjekker specifik besked
  });

  it("should return false for names with only whitespace", () => {
    const name = " ";
    const result = validateLastName(name);
    expect(result.isValid).toBe(false);
    expect(result.message).toBe("Last name cannot be empty"); // Tjekker specifik besked
  });

  it("should return false for names with numbers", () => {
    const name = "Smith1";
    const result = validateLastName(name);
    expect(result.isValid).toBe(false);
    expect(result.message).toBe("Last name can only contain letters, spaces, and hyphens"); // Tjekker specifik besked
  });
});
