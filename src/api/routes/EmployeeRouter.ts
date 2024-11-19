import express, { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "../middleware/Authentication.js";

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
router.get(
  "/employee",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const employees = await prisma.employees.findMany({
        include: {
          jobtitles: true,
          departments_employees_DepartmentIDTodepartments: true,
          departments_departments_ManagerIDToemployees: true,
          person: true,
        },
      });
      console.log(employees);
      res.send(employees);
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: "Failed to get employees" });
    }
  }
);

router.get("/members", async (req: Request, res: Response) => {
  try {
    const members = await prisma.members.findMany({
      include: {
        person: true,
      },
    });
    console.log(members);
    res.send(members);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Failed to get employees" });
  }
});

export { router as EmployeeRouter };
