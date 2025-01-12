import { describe, it, expect, afterEach } from "vitest";
import createEmployeeService from "../../src/api/services/EmployeeService";
import { PrismaClient } from "@prisma/client";
import { EmployeeInput } from "../../src/types/input-types/EmployeeInput";

const prisma = new PrismaClient();

describe("Employee Service - Integration Tests", () => {
  const sqlService = createEmployeeService("sql");

  // Testdata
  const sampleEmployee: EmployeeInput = {
    FirstName: "John",
    LastName: "Doe",
    Email: "john.doe@example.com",
    Phone: "12345678",
    Address: "123 Test Street",
    DateOfBirth: "1990-01-01",
    HireDate: "2022-01-01",
    JobTitleID: 1,
    DepartmentID: 1,
    Salary: 50000,
    EmploymentStatus: "Active",
  };

  // Liste over oprettede medarbejdere til oprydning
  const createdEmployeeIds: number[] = [];

  // Ryd op efter hver test
  afterEach(async () => {
    // Slet nyoprettede medarbejdere og tilhørende personer
    for (const employeeId of createdEmployeeIds) {
      try {
        const employee = await prisma.employees.findUnique({
          where: { EmployeeID: employeeId },
        });
  
        if (employee) {
          // Slet medarbejder
          await prisma.employees.delete({
            where: { EmployeeID: employeeId },
          });
  
          // Slet person, hvis der ikke er flere referencer til denne
          if (employee.PersonID !== null) {
            const relatedEmployees = await prisma.employees.findMany({
              where: { PersonID: employee.PersonID },
            });
  
            if (relatedEmployees.length === 0) {
              await prisma.person.delete({
                where: { PersonID: employee.PersonID },
              });
            }
          }
        }
      } catch (error) {
        console.error(`Error cleaning up employee with ID ${employeeId}:`, error);
      }
    }
  
    // Tøm listen over oprettede medarbejdere
    createdEmployeeIds.length = 0;
  });
  

  describe("SQL Strategy (Prisma)", () => {
    it("should add and retrieve an employee", async () => {
      // Tilføj medarbejder
      const createdEmployee = await sqlService.add(sampleEmployee);
      createdEmployeeIds.push(createdEmployee.EmployeeID); // Tilføj til oprydningslisten

      expect(createdEmployee).toHaveProperty("EmployeeID");

      // Hent medarbejderen
      const fetchedEmployee = await sqlService.getById({
        id: createdEmployee.EmployeeID,
      });

      expect(fetchedEmployee).toMatchObject({
        person: {
          FirstName: sampleEmployee.FirstName,
          Email: sampleEmployee.Email,
        },
        JobTitleID: sampleEmployee.JobTitleID,
        EmploymentStatus: sampleEmployee.EmploymentStatus,
      });
    });

    it("should update an employee", async () => {
        // Tilføj medarbejder
        const createdEmployee = await sqlService.add(sampleEmployee);
        createdEmployeeIds.push(createdEmployee.EmployeeID); // Tilføj til oprydningslisten
      
        // Opdater medarbejderen
        const updatedData = { ...sampleEmployee, Salary: 60000 };
        const updatedEmployee = await sqlService.update(
          { id: createdEmployee.EmployeeID },
          updatedData
        );
      
        // Kontroller at opdatering er sket korrekt
        expect(Number(updatedEmployee.Salary)).toBe(60000); // Konverter til nummer
      
        // Hent den opdaterede medarbejder
        const fetchedEmployee = await sqlService.getById({
          id: createdEmployee.EmployeeID,
        });
      
        // Kontroller at ændringen er korrekt i databasen
        expect(Number(fetchedEmployee.Salary)).toBe(60000); // Konverter til nummer
      });
      

    it("should delete an employee", async () => {
      // Tilføj medarbejder
      const createdEmployee = await sqlService.add(sampleEmployee);
      createdEmployeeIds.push(createdEmployee.EmployeeID); // Tilføj til oprydningslisten

      // Slet medarbejder
      const deleteResult = await sqlService.delete({
        id: createdEmployee.EmployeeID,
      });

      expect(deleteResult).toHaveProperty("EmployeeID", createdEmployee.EmployeeID);

      // Tjek at medarbejderen ikke findes
      const fetchedEmployee = await sqlService.getById({
        id: createdEmployee.EmployeeID,
      });

      expect(fetchedEmployee).toHaveProperty("error", "Employee not found");

      // Fjern fra oprydningslisten, da den allerede er slettet
      createdEmployeeIds.pop();
    });
  });
});
