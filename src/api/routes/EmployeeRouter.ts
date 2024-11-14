import express, { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

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
router.get("/employee", async (req: Request, res: Response) => {
  try {
    const employees = await prisma.employees.findMany({
      include: {
        jobtitles: true,
        departments_employees_DepartmentIDTodepartments: true,
        departments_departments_ManagerIDToemployees: true,
      },
    });
    console.log(employees);
    res.send(employees);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Failed to get employees" });
  }
});

export { router as EmployeeRouter };
