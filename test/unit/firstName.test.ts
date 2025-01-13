import { validateName } from "../../src/api/helpers/Validator";
import { describe, expect, it } from "vitest";

describe("validateFirstName function", () => {
  const validNames = ["John", "Jane", "John Doe", "Jane Doe"];
  const invalidNames = [
    "",
    " ",
    "John1",
    "John Doe1",
    "John1 Doe",
    "John-Doe1",
  ];

  it("should return true for valid names", () => {
    for (const name of validNames) {
      const result = validateName(name);
      expect(result.isValid).toBe(true);
    }
  });

  it("should return false for invalid names", () => {
    for (const name of invalidNames) {
      const result = validateName(name);
      expect(result.isValid).toBe(false);
      expect(result.message).toBeDefined();
    }
  });

  it("should return false for empty names", () => {
    const name = "";
    const result = validateName(name);
    expect(result.isValid).toBe(false);
    expect(result.message).toBe("Name cannot be empty");
  });

  it("should return false for names with only whitespace", () => {
    const name = " ";
    const result = validateName(name);
    expect(result.isValid).toBe(false);
    expect(result.message).toBe("Name cannot be empty");
  });

  it("should return false for names with numbers", () => {
    const name = "John1";
    const result = validateName(name);
    expect(result.isValid).toBe(false);
    expect(result.message).toBe(
      "Name can only contain letters, spaces, and hyphens"
    );
  });
});
