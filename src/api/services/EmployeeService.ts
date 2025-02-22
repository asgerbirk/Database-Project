import { PrismaClient } from "@prisma/client";
import { EmployeeInput } from "../../types/input-types/EmployeeInput.js";
import { validateDateOfBirth, validateEmail, validatePhoneNumber, validateZodName } from "../helpers/Validator.js";

// Type definitions
type DatabaseStrategy = {
  getAll: () => Promise<any[] | { error: string }>;
  getById: (id: any) => Promise<any | { error: string }>;
  add: (employee: EmployeeInput) => Promise<any | { error: string }>;
  update: (employee: EmployeeInput, id: any) => Promise<any | { error: string }>;
  delete: (id: any) => Promise<any | { error: string }>;
};

// Prisma Database Strategy
const createPrismaStrategy = (): DatabaseStrategy => {
  const prisma = new PrismaClient();

  return {
    getAll: async () => {
      try {
        return await prisma.employees.findMany({
          include: {
            jobtitles: true,
            person: true,
          },
        });
      } catch (error) {
        return { error: "Failed to get employees" };
      }
    },

    getById: async (id: any) => {
      try {
        const employee = await prisma.employees.findUnique({
          where: { EmployeeID: parseInt(id.id) },
          include: {
            jobtitles: true,
            person: true,
          },
        });

        if (!employee) {
          return { error: "Employee not found" };
        }
        return employee;
      } catch (error) {
        console.error(error);
        return { error: "Failed to get employee" };
      }
    },

    add: async (employee: EmployeeInput) => {
      try {
        const {
          FirstName,
          LastName,
          Email,
          Phone,
          Address,
          DateOfBirth,
          HireDate,
          JobTitleID,
          DepartmentID,
          Salary,
          EmploymentStatus,
        } = employee;

        // Valider input
        const firstNameValidation = validateZodName(FirstName);
        if (!firstNameValidation.isValid) {
          return { error: firstNameValidation.message };
        }

        const lastNameValidation = validateZodName(LastName);
        if (!lastNameValidation.isValid) {
          return { error: lastNameValidation.message };
        }

        const emailValidation = validateEmail(Email);
        if (!emailValidation.isValid) {
          return { error: emailValidation.message };
        }

        const phoneValidation = validatePhoneNumber(Phone);
        if (!phoneValidation.isValid) {
          return { error: phoneValidation.message };
        }

        const dobValidation = validateDateOfBirth(DateOfBirth);
        if (!dobValidation.isValid) {
          return { error: dobValidation.message };
        }

        // Check if the person already exists
        let person = await prisma.person.findUnique({
          where: { Email },
        });

        // If person doesn't exist, create a new one
        if (!person) {
          person = await prisma.person.create({
            data: { FirstName, LastName, Email, Phone, Address, DateOfBirth: new Date(DateOfBirth) },
          });
        }

        // Create the employee
        return await prisma.employees.create({
          data: {
            PersonID: person.PersonID,
            HireDate: new Date(HireDate),
            JobTitleID,
            DepartmentID,
            Salary,
            EmploymentStatus,
          },
        });
      } catch (error) {
        console.error(error);
        return { error: "Failed to create employee" };
      }
    },

    update: async (employee: EmployeeInput, id: any) => {
      const { JobTitleID, DepartmentID, Salary, EmploymentStatus } = employee;
      try {
        return await prisma.employees.update({
          where: { EmployeeID: parseInt(id.id) },
          data: { JobTitleID, DepartmentID, Salary, EmploymentStatus },
          include: { jobtitles: true, person: true },
        });
      } catch (error) {
        console.error(error);
        return { error: "Failed to update employee" };
      }
    },

    delete: async (id: any) => {
      try {
        return await prisma.employees.delete({
          where: { EmployeeID: parseInt(id.id) },
        });
      } catch (error) {
        console.error(error);
        return { error: "Failed to delete employee" };
      }
    },
  };
};

// Employee Service Factory Function
export const createEmployeeService = () => {
  const strategy = createPrismaStrategy();

  return {
    getAll: () => strategy.getAll(),
    getById: (id: any) => strategy.getById(id),
    add: (employee: EmployeeInput) => strategy.add(employee),
    update: (id: any, employee: EmployeeInput) => strategy.update(employee, id),
    delete: (id: any) => strategy.delete(id),
  };
};

export default createEmployeeService;