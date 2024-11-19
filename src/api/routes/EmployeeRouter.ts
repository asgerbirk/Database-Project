import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { EmployeeInput } from "../../types/input-types/EmployeeInput.js";

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /employees:
 *   get:
 *     summary: Retrieve a list of employees
 *     description: Fetches all employees from the database.
 *     tags: [Employees]
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of employees.
 *       500:
 *         description: Internal server error occurred.
 */
router.get("/employees", async (req: Request, res: Response) => {
  try {
    const employees = await prisma.employees.findMany({
      include: {
        jobtitles: true,
        person: true,
        departments_employees_DepartmentIDTodepartments: true,
        departments_departments_ManagerIDToemployees: true,
      },
    });
    res.send(employees);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to get employees" });
  }
});

/**
 * @swagger
 * /employees/{id}:
 *   get:
 *     summary: Retrieve a specific employee
 *     description: Fetches an employee by their ID.
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the employee to retrieve.
 *     responses:
 *       200:
 *         description: Successfully retrieved the employee.
 *       404:
 *         description: Employee not found.
 *       500:
 *         description: Internal server error occurred.
 */
router.get("/employees/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
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
      return res.status(404).send({ error: "Employee not found" });
    }

    res.send(employee);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to get employee" });
  }
});

/**
 * @swagger
 * /employees:
 *   post:
 *     summary: Create a new employee
 *     description: Creates a new employee with associated personal and employment details.
 *     tags: [Employees]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               FirstName:
 *                 type: string
 *               LastName:
 *                 type: string
 *               Email:
 *                 type: string
 *               Phone:
 *                 type: string
 *               Address:
 *                 type: string
 *               DateOfBirth:
 *                 type: string
 *                 format: date
 *               HireDate:
 *                 type: string
 *                 format: date
 *               JobTitleID:
 *                 type: integer
 *               DepartmentID:
 *                 type: integer
 *               Salary:
 *                 type: number
 *               EmploymentStatus:
 *                 type: string
 *     responses:
 *       201:
 *         description: Employee successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 EmployeeID:
 *                   type: integer
 *                 PersonId:
 *                   type: integer
 *                 HireDate:
 *                   type: string
 *                   format: date
 *                 JobTitleID:
 *                   type: integer
 *                 DepartmentID:
 *                   type: integer
 *                 Salary:
 *                   type: number
 *                 EmploymentStatus:
 *                   type: string
 *       400:
 *         description: Validation error or bad request.
 *       500:
 *         description: Internal server error.
 */
router.post("/employees", async (req: Request<{}, {}, EmployeeInput>, res: Response) => {
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
  } = req.body;

  try {
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

    res.status(201).send(newEmployee);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to create employee" });
  }
});



/**
 * @swagger
 * /employees/{id}:
 *   put:
 *     summary: Update an existing employee
 *     description: Updates an employee's details.
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the employee to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               properties:
 *               FirstName:
 *                 type: string
 *               LastName:
 *                 type: string
 *               Email:
 *                 type: string
 *               Phone:
 *                 type: string
 *               Address:
 *                 type: string
 *               DateOfBirth:
 *                 type: string
 *                 format: date
 *               HireDate:
 *                 type: string
 *                 format: date
 *               JobTitleID:
 *                 type: integer
 *               DepartmentID:
 *                 type: integer
 *               Salary:
 *                 type: number
 *               EmploymentStatus:
 *                 type: string
 *     responses:
 *       200:
 *         description: Employee updated successfully.
 *       404:
 *         description: Employee not found.
 *       500:
 *         description: Internal server error occurred.
 */
router.put("/employees/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { HireDate, JobTitleID, DepartmentID, Salary, EmploymentStatus } = req.body;
  try {
    const updatedEmployee = await prisma.employees.update({
      where: { EmployeeID: parseInt(id) },
      data: { HireDate, JobTitleID, DepartmentID, Salary, EmploymentStatus },
    });
    res.send(updatedEmployee);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to update employee" });
  }
});

/**
 * @swagger
 * /employees/{id}:
 *   delete:
 *     summary: Delete an employee
 *     description: Removes an employee from the database.
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the employee to delete.
 *     responses:
 *       204:
 *         description: Employee deleted successfully.
 *       404:
 *         description: Employee not found.
 *       500:
 *         description: Internal server error occurred.
 */
router.delete("/employees/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.employees.delete({
      where: { EmployeeID: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to delete employee" });
  }
});

export { router as EmployeeRouter };
