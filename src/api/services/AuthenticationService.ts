import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const prisma = new PrismaClient();
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const SALT_ROUNDS = 10;

const JWT_SECRET = process.env.JWT_TOKEN;

const REFRESH_TOKEN = process.env.REFRESH_TOKEN_SECRET;

const JWT_EXPIRATION = process.env.JWT_EXPIRATION;
const REFRESH_TOKEN_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION;

export async function register(
  data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    dateOfBirth?: string;
    //role?: "ADMIN" | "MEMBER";
    ImageUrl?: string;
    joinDate?: string;
    emergencyContact?: string;
    memberShip: string;
  },
  file?: Express.Multer.File // Separate the image file
) {
  const existingUser = await prisma.person.findUnique({
    where: { Email: data.email },
  });

  if (existingUser) {
    throw new Error("Email is already taken");
  }

  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

  let imageUrl: string | null = null;
  if (file) {
    const originalName = `${Date.now()}-${file.originalname}`;
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME || "",
      Key: originalName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    await s3Client.send(new PutObjectCommand(params));
    imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${originalName}`;
  }

  const newUser = await prisma.person.create({
    data: {
      Email: data.email,
      Password: hashedPassword,
      FirstName: data.firstName || null,
      LastName: data.lastName || null,
      Phone: data.phone || null,
      Address: data.address || null,
      DateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
      //Role: "MEMBER",
      ImageUrl: imageUrl,
      member: {
        create: {
          MembershipID: parseInt(data.memberShip, 10),
          JoinDate: new Date(),
          EmergencyContact: data.emergencyContact || null,
        },
      },
    },
    include: {
      member: true,
    },
  });

  return newUser;
}

export async function getAllPersons() {
  const getAllPersons = await prisma.person.findMany({
    include: {
      member: true,
      employee: true,
    },
  });
  return getAllPersons;
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
    {
      userId: findUserByEmail.PersonID,
      email: findUserByEmail.Email,
      name: findUserByEmail.FirstName,
      role: findUserByEmail.Role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRATION }
  );

  const refreshToken = jwt.sign(
    {
      userId: findUserByEmail.PersonID,
      email: findUserByEmail.Email,
      name: findUserByEmail.FirstName,
      role: findUserByEmail.Role,
    },
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
