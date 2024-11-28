import { z } from "zod";

const userSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8, "Password needs to be atleast 8 characters long"),
  role: z.string(),
  createdAt: z.string(),
  updatedAt: z.string()
})


export type User = z.infer<typeof userSchema>;