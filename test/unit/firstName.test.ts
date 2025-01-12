import { validateFirstName } from "../../src/api/services/Validator";
import { describe, expect, it } from "vitest";

describe("validateFirstName function", () => {
  const validNames = ["John", "Jane", "John Doe", "Jane Doe"];
  const invalidNames = ["", " ", "John1", "John Doe1", "John1 Doe", "John-Doe1"];

  it("should return true for valid names", () => {
    for (const name of validNames) {
      const result = validateFirstName(name);
      expect(result.isValid).toBe(true); // Tjekker kun isValid
    }
  });

  it("should return false for invalid names", () => {
    for (const name of invalidNames) {
      const result = validateFirstName(name);
      expect(result.isValid).toBe(false); // Tjekker kun isValid
      expect(result.message).toBeDefined(); // Sikrer at der er en fejlbesked
    }
  });

  it("should return false for empty names", () => {
    const name = "";
    const result = validateFirstName(name);
    expect(result.isValid).toBe(false);
    expect(result.message).toBe("First name cannot be empty"); // Tjekker specifik besked
  });

  it("should return false for names with only whitespace", () => {
    const name = " ";
    const result = validateFirstName(name);
    expect(result.isValid).toBe(false);
    expect(result.message).toBe("First name cannot be empty"); // Tjekker specifik besked
  });

  it("should return false for names with numbers", () => {
    const name = "John1";
    const result = validateFirstName(name);
    expect(result.isValid).toBe(false);
    expect(result.message).toBe("First name can only contain letters, spaces, and hyphens"); // Tjekker specifik besked
  });
});
