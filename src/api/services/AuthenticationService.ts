import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { S3Client, PutObjectCommand, ServerSideEncryption } from "@aws-sdk/client-s3";
import { RegistrationSchema } from "../../types/signup.js";
import { validateEmail, validateZodPassword, validateZodName, validatePhoneNumber, validateDateOfBirth, validateMembershipId } from "../helpers/Validator.js";

const prisma = new PrismaClient();
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

//random data added to a password before it is hashed
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
  // TODO Tag hjælpe funktioner fra Validator.ts i brug
  data: RegistrationSchema, 
  /*
  data: {
    role?: "ADMIN" | "MEMBER";
    joinDate?: string;
  },
  */
  file?: Express.Multer.File // Separate the image file
) {
  // Validering
  const emailValidation = validateEmail(data.email);
  if (!emailValidation.isValid) {
    throw new Error(emailValidation.message);
  }

  const passwordValidation = validateZodPassword(data.password);
  if (!passwordValidation.isValid) {
    throw new Error(passwordValidation.message);
  }

  if (data.firstName) {
    const firstNameValidation = validateZodName(data.firstName);
    if (!firstNameValidation.isValid) {
      throw new Error(firstNameValidation.message);
    }
  }

  if (data.lastName) {
    const lastNameValidation = validateZodName(data.lastName);
    if (!lastNameValidation.isValid) {
      throw new Error(lastNameValidation.message);
    }
  }

  if (data.phone) {
    const phoneValidation = validatePhoneNumber(data.phone);
    if (!phoneValidation.isValid) {
      throw new Error(phoneValidation.message);
    }
  }

  if (data.dateOfBirth) {
    const dobValidation = validateDateOfBirth(data.dateOfBirth);
    if (!dobValidation.isValid) {
      console.log(data.dateOfBirth);
      console.log("Date of birth validation failed:", dobValidation.message);
      throw new Error(dobValidation.message);
    }
  }

  if (data.membershipId) {
    if (!validateMembershipId(data.membershipId)) {
      console.log("Membership ID validation failed: Invalid membership ID");
      throw new Error("Invalid membership ID");
    }
  }

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
  console.log('Data '+data.email);
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
      Role: "MEMBER",
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

export async function createAdminUser(
  data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    dateOfBirth?: string;
    imageUrl?: string;
  },
  file?: Express.Multer.File // Optional profile picture upload
) {

  // Validering
  const emailValidation = validateEmail(data.email);
  if (!emailValidation.isValid) {
    console.log("Email validation failed:", emailValidation.message);
    throw new Error(emailValidation.message);
  }

  const passwordValidation = validateZodPassword(data.password);
  if (!passwordValidation.isValid) {
    console.log("Password validation failed:", passwordValidation.message);
    throw new Error(passwordValidation.message);
  }

  if (data.firstName) {
    const firstNameValidation = validateZodName(data.firstName);
    if (!firstNameValidation.isValid) {
      console.log("First name validation failed:", firstNameValidation.message);
      throw new Error(firstNameValidation.message);
    }
  }

  if (data.lastName) {
    const lastNameValidation = validateZodName(data.lastName);
    if (!lastNameValidation.isValid) {
      console.log("Last name validation failed:", lastNameValidation.message);
      throw new Error(lastNameValidation.message);
    }
  }

  if (data.phone) {
    const phoneValidation = validatePhoneNumber(data.phone);
    if (!phoneValidation.isValid) {
      console.log("Phone validation failed:", phoneValidation.message);
      throw new Error(phoneValidation.message);
    }
  }
  if (data.dateOfBirth) {
    const dobValidation = validateDateOfBirth(data.dateOfBirth);
    if (!dobValidation.isValid) {
      throw new Error(dobValidation.message);
    }
  }

  // Check if the email is already in use
  const existingUser = await prisma.person.findUnique({
    where: { Email: data.email },
  });

  if (existingUser) {
    throw new Error("Email is already taken");
  }

  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

  let profileImageUrl: string | null = null;

  // Handle file upload to S3 if a profile picture is provided
  if (file) {
    const uniqueFileName = `${Date.now()}-${file.originalname}`;
    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME || "",
      Key: uniqueFileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    // Upload file to S3
    await s3Client.send(new PutObjectCommand(uploadParams));
    profileImageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${uniqueFileName}`;
  }

  // Create the admin user in the database
  const adminUser = await prisma.person.create({
    data: {
      Email: data.email,
      Password: hashedPassword,
      FirstName: data.firstName || null,
      LastName: data.lastName || null,
      Phone: data.phone || null,
      Address: data.address || null,
      DateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
      ImageUrl: profileImageUrl,
      Role: "ADMIN", // Set the role to ADMIN
    },
  });

  return adminUser;
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
  const findUserByEmail = await prisma.person.findUnique({
    where: { Email: data.email },
    include: {
      member: true, // Include member information if it exists
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

  // Prepare user payload for JWT generation
  const jwtPayload = {
    userId: findUserByEmail.PersonID,
    email: findUserByEmail.Email,
    name: findUserByEmail.FirstName,
    role: findUserByEmail.Role,
    memberId: findUserByEmail.member?.MemberID || null, // Handle cases where member might not exist
  };

  // Generate an access token with user details
  const accessToken = jwt.sign(jwtPayload, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION,
  });

  // Log token details for debugging
  const decodedAccessTokenHeader = jwt.decode(accessToken, {
    complete: true,
  })?.header;
  console.log("Access Token Algorithm:", decodedAccessTokenHeader?.alg);

  // Generate a refresh token with user details
  const refreshToken = jwt.sign(jwtPayload, REFRESH_TOKEN, {
    expiresIn: REFRESH_TOKEN_EXPIRATION,
  });

  // Return the generated tokens
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
