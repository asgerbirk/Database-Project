import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { error } from "console";

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;

const JWT_SECRET = process.env.JWT_TOKEN;

const REFRESH_TOKEN = process.env.REFRESH_TOKEN_SECRET;

const JWT_EXPIRATION = process.env.JWT_EXPIRATION;
const REFRESH_TOKEN_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION;

export async function register(data: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: Date;
}) {
  const existingUser = await prisma.person.findUnique({
    where: { Email: data.email },
  });

  if (existingUser) {
    throw new Error("Email is already taken");
  }

  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

  const newUser = await prisma.person.create({
    data: {
      Email: data.email,
      Password: hashedPassword,
      FirstName: data.firstName || null,
      LastName: data.lastName || null,
      Phone: data.phone || null,
      Address: data.address || null,
      DateOfBirth: data.dateOfBirth || null,
    },
  });

  return {
    id: newUser.Id,
    email: newUser.Email,
    firstName: newUser.FirstName,
    lastName: newUser.LastName,
    phone: newUser.Phone,
    address: newUser.Address,
    dateOfBirth: newUser.DateOfBirth,
  };
}

export async function login(data: { email: string; password: string }) {
  const findUserByEmail = await prisma.person.findUnique({
    where: { Email: data.email },
  });

  if (!findUserByEmail) {
    throw new Error("No user with that email");
  }

  const isPasswordValid = await bcrypt.compare(
    data.password,
    findUserByEmail.Password
  );

  if (!isPasswordValid) {
    throw new Error("Password is not valid");
  }

  const accessToken = jwt.sign(
    { userId: findUserByEmail.Id, email: findUserByEmail.Email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRATION }
  );

  const refreshToken = jwt.sign(
    { userId: findUserByEmail.Id, email: findUserByEmail.Email },
    REFRESH_TOKEN,
    { expiresIn: REFRESH_TOKEN_EXPIRATION }
  );
  return { accessToken, refreshToken };
}

export async function refreshToken(data: { token: string }) {
  try {
    const payload = jwt.verify(data.token, REFRESH_TOKEN) as {
      userId: number;
      email: string;
    };

    const newAccessToken = jwt.sign(
      { userId: payload.userId, email: payload.email },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRATION,
      }
    );

    return {
      accessToken: newAccessToken,
    };
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
}

export async function logout() {
  return { message: "Logout successful" };
}
