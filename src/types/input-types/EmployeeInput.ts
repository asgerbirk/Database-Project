import {z} from 'zod';

const employeeSchema = z.object({
    FirstName: z.string(),
    LastName: z.string(),
    Email: z.string().email(),
    Phone: z.string().min(1).max(8),
    Address: z.string(),
    DateOfBirth: z.string(),
    HireDate: z.string(),
    JobTitleID: z.number(),
    DepartmentID: z.number(),
    Salary: z.number(),
    EmploymentStatus: z.string(),
  });
  
  export type EmployeeInput = z.infer<typeof employeeSchema>;