import express from "express";
import { Add, Delete, getAll, getById, Update } from "../controllers/EmployeeController.js";

const router = express.Router();
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
router.get("/employees", getAll)


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
router.get("/employees/:id", getById)


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
router.post("/employees", Add)

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
router.put("/employees/:id", Update)


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
router.delete("/employees/:id", Delete)

export { router as EmployeeRouter };
