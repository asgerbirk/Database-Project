import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import {
  S3Client,
  PutObjectCommand,
  ServerSideEncryption,
} from "@aws-sdk/client-s3";

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

// Function to register a new user.
//Validates the uniqueness of the email address.
//Hashes the password using bcrypt.
//Optionally uploads the user's profile image to S3 with server-side encryption.
//Stores user details in the database, including secure fields like the hashed password.

export async function register(
  data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    dateOfBirth?: string;
    role?: "ADMIN" | "MEMBER";
    ImageUrl?: string;
    joinDate?: string;
    emergencyContact?: string;
    membershipId: string;
  },
  file?: Express.Multer.File // Separate the image file
) {
  const existingUser = await prisma.person.findUnique({
    where: { Email: data.email },
  });

  if (existingUser) {
    throw new Error("Email is already taken");
  }

  // Hash the user's password securely
  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

  // Upload the profile image securely to S3
  let imageUrl: string | null = null;
  if (file) {
    const originalName = `${Date.now()}-${file.originalname}`;
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME || "",
      Key: originalName,
      Body: file.buffer,
      ContentType: file.mimetype,
      ServerSideEncryption: "AES256" as "AES256", // Enforce server-side encryption
    };

    await s3Client.send(new PutObjectCommand(params));
    // Generate a secure URL for the uploaded image
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
      ImageUrl: imageUrl,
      member: {
        create: {
          MembershipID: parseInt(data.membershipId),
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
  // Look up the user by their email address
  // Use "include" to fetch related member information
  const findUserByEmail = await prisma.person.findUnique({
    where: { Email: data.email },
    include: {
      member: true,
    },
  });
  // If no user is found, throw an error
  if (!findUserByEmail) {
    throw new Error("No user with that email");
  }

  // Compare the provided password with the stored hashed password
  const isPasswordValid = await bcrypt.compare(
    data.password,
    findUserByEmail.Password
  );

  // If the password is invalid, throw an error

  if (!isPasswordValid) {
    throw new Error("Password is not valid");
  }

  // Generate an access token with user details
  // Use the JWT_SECRET environment variable for signing
  // Set an expiration time using JWT_EXPIRATION
  const accessToken = jwt.sign(
    {
      userId: findUserByEmail.PersonID,
      email: findUserByEmail.Email,
      memberId: findUserByEmail.member.MemberID,
      name: findUserByEmail.FirstName,
      role: findUserByEmail.Role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRATION }
  );

  // Decode the JWT accesstoken
  const decodedAccessTokenHeader = jwt.decode(accessToken, {
    complete: true,
  })?.header;
  console.log("Access Token Algorithm:", decodedAccessTokenHeader?.alg);

  const refreshToken = jwt.sign(
    {
      userId: findUserByEmail.PersonID,
      email: findUserByEmail.Email,
      memberId: findUserByEmail.member.MemberID,
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
