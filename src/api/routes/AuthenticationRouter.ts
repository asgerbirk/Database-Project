import { Router } from "express";
import {
  register,
  login,
  refreshToken,
  getAllPersons, createAdminUser,
} from "../controllers/AuthenticationController.js";
import multer from "multer";
import { generateCsrf } from "../middleware/csrfProtection.js";

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email.
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: The user's password.
 *                 example: password123
 *               firstName:
 *                 type: string
 *                 description: The user's first name.
 *                 example: John
 *               lastName:
 *                 type: string
 *                 description: The user's last name.
 *                 example: Doe
 *               phone:
 *                 type: string
 *                 description: The user's phone number.
 *                 example: "1234567890"
 *               address:
 *                 type: string
 *                 description: The user's address.
 *                 example: "123 Main St"
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 description: The user's date of birth.
 *                 example: "1990-01-01"
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Profile picture of the user.
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 email:
 *                   type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 address:
 *                   type: string
 *                 dateOfBirth:
 *                   type: string
 *                   format: date
 *                 role:
 *                   type: string
 *                 imageUrl:
 *                   type: string
 *                 emergencyData:
 *                   type: string
 *       400:
 *         description: Bad Request
 */
router.post("/register", upload.single("image"), register);

/**
 * @swagger
 * /registerAdminUser:
 *   post:
 *     summary: Register a new admin user
 *     tags: [Admin Management]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The admin's email address.
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 description: The admin's password.
 *                 example: secureAdminPassword
 *               firstName:
 *                 type: string
 *                 description: The admin's first name.
 *                 example: Alice
 *               lastName:
 *                 type: string
 *                 description: The admin's last name.
 *                 example: Johnson
 *               phone:
 *                 type: string
 *                 description: The admin's phone number.
 *                 example: "1234567890"
 *               address:
 *                 type: string
 *                 description: The admin's address.
 *                 example: "Admin HQ, Main Street"
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 description: The admin's date of birth.
 *                 example: "1985-01-01"
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Profile picture of the admin.
 *     responses:
 *       201:
 *         description: Admin user created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the admin user.
 *                   example: 1
 *                 email:
 *                   type: string
 *                   description: The email address of the admin user.
 *                   example: admin@example.com
 *                 firstName:
 *                   type: string
 *                   description: The first name of the admin user.
 *                   example: Alice
 *                 lastName:
 *                   type: string
 *                   description: The last name of the admin user.
 *                   example: Johnson
 *                 phone:
 *                   type: string
 *                   description: The phone number of the admin user.
 *                   example: "1234567890"
 *                 address:
 *                   type: string
 *                   description: The address of the admin user.
 *                   example: "Admin HQ, Main Street"
 *                 dateOfBirth:
 *                   type: string
 *                   format: date
 *                   description: The date of birth of the admin user.
 *                   example: "1985-01-01"
 *                 role:
 *                   type: string
 *                   description: The role of the admin user.
 *                   example: ADMIN
 *                 imageUrl:
 *                   type: string
 *                   description: The URL of the admin's profile picture.
 *                   example: "https://bucket-name.s3.amazonaws.com/profile.jpg"
 *       400:
 *         description: Bad Request - Validation failed or email already taken
 */
router.post("/registerAdminUser", upload.single("image"), createAdminUser);
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email.
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: The user's password.
 *                 example: password123
 *     responses:
 *       201:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *       400:
 *         description: Bad Request
 */
router.post("/login", generateCsrf, login);

/**
 * @swagger
 * /refreshToken:
 *   post:
 *     summary: Refresh access token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: The refresh token.
 *                 example: your_refresh_token_here
 *     responses:
 *       200:
 *         description: Access token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Access token refreshed successfully
 *       400:
 *         description: Bad Request
 */
router.post("/refreshToken", refreshToken);

router.get("/persons", getAllPersons);

export { router as AuthenticationRouter };
