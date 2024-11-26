import { PrismaClient } from "@prisma/client";
import { EmployeeInput } from "../../types/input-types/EmployeeInput.js";


const prisma = new PrismaClient();

export async function getAll() {
    try {
        const employees = await prisma.employees.findMany({
            include: {
                jobtitles: true,
                person: true,
                departments_employees_DepartmentIDTodepartments: true,
                departments_departments_ManagerIDToemployees: true,
            },
        });
        return (employees);
    } catch (error) {
        return ({ error: "Failed to get employees" });
    }
}

export async function getById(id: any) {
    try {
        const employee = await prisma.employees.findUnique({
            where: { EmployeeID: parseInt(id) },
            include: {
                jobtitles: true,
                person: true,
                departments_employees_DepartmentIDTodepartments: true,
                departments_departments_ManagerIDToemployees: true,
            },
        });

        if (!employee) {
            return ({ error: "Employee not found" });
        }
        return (employee);
    } catch (error) {
        console.error(error);
        return ({ error: "Failed to get employee" });
    }
}

export async function Add(employee: EmployeeInput) {
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
        // Check if the person already exists based on Email
        let person = await prisma.person.findUnique({
            where: { Email },
        });

        // If person doesn't exist, create a new one
        if (!person) {
            person = await prisma.person.create({
                data: { FirstName, LastName, Email, Phone, Address, DateOfBirth },
            });
        }

        // Create the employee with the PersonId from the person record
        const newEmployee = await prisma.employees.create({
            data: {
                PersonId: person.Id,
                HireDate,
                JobTitleID,
                DepartmentID,
                Salary,
                EmploymentStatus,
            },
        });

        return (newEmployee);
    } catch (error) {
        console.error(error);
        return ({ error: "Failed to create employee" });
    }
}

export async function Update(employee: EmployeeInput, id: string) {
    const { HireDate, JobTitleID, DepartmentID, Salary, EmploymentStatus } =
        employee
    try {
        const updatedEmployee = await prisma.employees.update({
            where: { EmployeeID: parseInt(id) },
            data: { HireDate, JobTitleID, DepartmentID, Salary, EmploymentStatus },
        });
        return (updatedEmployee);
    } catch (error) {
        console.error(error);
        return ({ error: "Failed to update employee" });
    }
}

export async function Delete(id: any) {
    try {
        return await prisma.employees.delete({
            where: { EmployeeID: parseInt(id) },
        });
    } catch (error) {
        console.error(error);
        return ({ error: "Failed to delete employee" });
    }
}


