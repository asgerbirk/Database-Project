import { describe, it, expect, afterEach } from "vitest";
import createEmployeeService from "../../src/api/services/EmployeeService";
import { PrismaClient } from "@prisma/client";
import { EmployeeInput } from "../../src/types/input-types/EmployeeInput";

const prisma = new PrismaClient();

describe("Employee Service - Integration Tests", () => {
  const sqlService = createEmployeeService("sql");

  const sampleEmployee: EmployeeInput = {
    FirstName: "John",
    LastName: "Doe",
    Email: "john.doe@example.com",
    Phone: "12345678",
    Address: "123 Test Street",
    DateOfBirth: "01/01/1990",
    HireDate: "01-01-2022",
    JobTitleID: 1,
    DepartmentID: 1,
    Salary: 50000,
    EmploymentStatus: "Active",
  };

  const createdEmployeeIds: number[] = [];

  afterEach(async () => {
    for (const employeeId of createdEmployeeIds) {
      try {
        const employee = await prisma.employees.findUnique({
          where: { EmployeeID: employeeId },
        });
  
        if (employee) {
          await prisma.employees.delete({
            where: { EmployeeID: employeeId },
          });
  
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
  
    createdEmployeeIds.length = 0;
  });
  

  describe("Membership CRUD", () => {
    it("should add and retrieve an employee", async () => {
      const createdEmployee = await sqlService.add(sampleEmployee);
      createdEmployeeIds.push(createdEmployee.EmployeeID);

      expect(createdEmployee).toHaveProperty("EmployeeID");

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
        const createdEmployee = await sqlService.add(sampleEmployee);
        createdEmployeeIds.push(createdEmployee.EmployeeID);
      
        const updatedData = { ...sampleEmployee, Salary: 60000 };
        const updatedEmployee = await sqlService.update(
          { id: createdEmployee.EmployeeID },
          updatedData
        );
      
        expect(Number(updatedEmployee.Salary)).toBe(60000); 
      
        const fetchedEmployee = await sqlService.getById({
          id: createdEmployee.EmployeeID,
        });
      
        expect(Number(fetchedEmployee.Salary)).toBe(60000); 
      });
      

    it("should delete an employee", async () => {
      const createdEmployee = await sqlService.add(sampleEmployee);
      createdEmployeeIds.push(createdEmployee.EmployeeID); 

      const deleteResult = await sqlService.delete({
        id: createdEmployee.EmployeeID,
      });

      expect(deleteResult).toHaveProperty("EmployeeID", createdEmployee.EmployeeID);

      const fetchedEmployee = await sqlService.getById({
        id: createdEmployee.EmployeeID,
      });

      expect(fetchedEmployee).toHaveProperty("error", "Employee not found");

      createdEmployeeIds.pop();
    });
  });
});
