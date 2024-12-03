import { PrismaClient } from "@prisma/client";
import { EmployeeInput } from "../../types/input-types/EmployeeInput.js";
import { ObjectId } from "mongodb";
import { MongoDBConnection } from "../../databases/mongoDB/mongoConnection.js"; // Adjust path as needed

// Define an interface for the database strategy
interface EmployeeRepository {
  getAll(): Promise<any[] | { error: string }>;
  getById(id: any): Promise<any | { error: string }>;
  add(employee: EmployeeInput): Promise<any | { error: string }>;
  update(employee: EmployeeInput, id: any): Promise<any | { error: string }>;
  delete(id: any): Promise<any | { error: string }>;
}

// SQL Strategy using Prisma
class PrismaEmployeeRepository implements EmployeeRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getAll() {
    try {
      const employees = await this.prisma.employees.findMany({
        include: {
          jobtitles: true,
          person: true,
          //departments_employees_DepartmentIDTodepartments: true,
          //departments_departments_ManagerIDToemployees: true,
        },
      });
      return employees;
    } catch (error) {
      return { error: "Failed to get employees" };
    }
  }

  async getById(id: any) {
    try {
      const employee = await this.prisma.employees.findUnique({
        where: { EmployeeID: parseInt(id) },
        include: {
          jobtitles: true,
          person: true,
          //departments_employees_DepartmentIDTodepartments: true,
          //departments_departments_ManagerIDToemployees: true,
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
  }

  async add(employee: EmployeeInput) {
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
      let person = await this.prisma.person.findUnique({
        where: { Email },
      });

      // If person doesn't exist, create a new one
      if (!person) {
        person = await this.prisma.person.create({
          data: { FirstName, LastName, Email, Phone, Address, DateOfBirth },
        });
      }

      // Create the employee with the PersonId from the person record
      const newEmployee = await this.prisma.employees.create({
        data: {
          PersonID: person.PersonID,
          HireDate,
          JobTitleID,
          DepartmentID,
          Salary,
          EmploymentStatus,
        },
      });

      return newEmployee;
    } catch (error) {
      console.error(error);
      return { error: "Failed to create employee" };
    }
  }

  async update(employee: EmployeeInput, id: string) {
    const { HireDate, JobTitleID, DepartmentID, Salary, EmploymentStatus } =
      employee;
    try {
      const updatedEmployee = await this.prisma.employees.update({
        where: { EmployeeID: parseInt(id) },
        data: { HireDate, JobTitleID, DepartmentID, Salary, EmploymentStatus },
      });
      return updatedEmployee;
    } catch (error) {
      console.error(error);
      return { error: "Failed to update employee" };
    }
  }

  async delete(id: any) {
    try {
      return await this.prisma.employees.delete({
        where: { EmployeeID: parseInt(id) },
      });
    } catch (error) {
      console.error(error);
      return { error: "Failed to delete employee" };
    }
  }
}

// MongoDB Strategy
class MongoEmployeeRepository implements EmployeeRepository {
  private collectionName: string;

  constructor(collectionName: string = "employees") {
    this.collectionName = collectionName;
  }

  private async getCollection() {
    return MongoDBConnection.getCollection(this.collectionName);
  }

  async getAll() {
    try {
      const collection = await this.getCollection();
      const employees = await collection.find({}).toArray();
      return employees;
    } catch (error) {
      console.error(error);
      return { error: "Failed to retrieve employees" };
    }
  }

  async getById(id: any) {
    try {
      const collection = await this.getCollection();
      const employee = await collection.findOne({ _id: new ObjectId(id) });

      if (!employee) {
        return { error: "Employee not found" };
      }

      return employee;
    } catch (error) {
      console.error(error);
      return { error: "Failed to retrieve employee" };
    }
  }

  async add(employee: EmployeeInput) {
    try {
      const collection = await this.getCollection();
      const result = await collection.insertOne(employee);
      return result.insertedId;
    } catch (error) {
      console.error(error);
      return { error: "Failed to create employee" };
    }
  }

  async update(employee: EmployeeInput, id: any) {
    try {
      const collection = await this.getCollection();
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: employee }
      );
      return result;
    } catch (error) {
      console.error(error);
      return { error: "Failed to update Employee" };
    }
  }

  async delete(id: any) {
    try {
      const collection = await this.getCollection();
      return await collection.deleteOne({ _id: new ObjectId(id) });
    } catch (error) {
      console.error(error);
      return { error: "Failed to delete Employee" };
    }
  }
}

// Employee Service Factory
export class EmployeeService {
  private repository: EmployeeRepository;

  constructor(dbType: "sql" | "mongo") {
    if (dbType === "sql") {
      this.repository = new PrismaEmployeeRepository();
    } else if (dbType === "mongo") {
      this.repository = new MongoEmployeeRepository();
    } else {
      throw new Error("Invalid database type");
    }
  }

  async getAll() {
    return this.repository.getAll();
  }

  async getById(id: any) {
    return this.repository.getById(id);
  }

  async add(employee: EmployeeInput) {
    return this.repository.add(employee);
  }

  async update(id: any, employee: EmployeeInput) {
    return this.repository.update(employee, id);
  }

  async delete(id: any) {
    return this.repository.delete(id);
  }
}

export default EmployeeService;
