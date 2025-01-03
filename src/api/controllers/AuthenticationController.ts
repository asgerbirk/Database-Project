import { Request, Response } from "express";
import * as AuthenticationService from "../services/AuthenticationService.js";
import cookie from "cookie";

export async function register(req: Request, res: Response) {
  try {
    const personData = req.body;
    const file = req.file;
    const newUser = await AuthenticationService.register(personData, file);
    res.status(201).send(newUser);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
}

export async function createAdminUser(req: Request, res: Response) {
    try {
        const personData = req.body;
        const file = req.file;
        const newUser = await AuthenticationService.createAdminUser(personData, file);
        res.status(201).send(newUser);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}

//Controller for user login.
//Receives email and password from the request body.
//Calls the `login` service to authenticate the user and generate tokens.

export async function login(req: Request, res: Response) {
  try {
    const { accessToken, refreshToken } = await AuthenticationService.login(
      req.body
    );

    res.setHeader("Set-Cookie", [
      cookie.serialize("accessToken", accessToken, {
        httpOnly: true,
        // true: Makes the cookie inaccessible to JavaScript running in the browser.
        // false: Allows JavaScript (e.g., via document.cookie) to read/write the cookie.

        secure: false, // Set to false during testing
        //true: The cookie is only sent to the server when using HTTPS.
        //false: The cookie can be sent over HTTP.

        sameSite: "strict",
        //strict": Cookies are sent only when the request originates from the same site as the target domain
        //Best for Security: Prevents cookies from being sent in cross-site requests, which reduces the risk of CSRF (Cross-Site Request Forgery) attacks.

        maxAge: 15 * 60, // 15 minutes in seconds
      }),
      cookie.serialize("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false, // Set to false during testing
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      }),
    ]);

    res.status(201).send({ message: "Login successful" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
}

export async function getAllPersons(req: Request, res: Response) {
  try {
    const getAllPersons = await AuthenticationService.getAllPersons();
    res.status(201).send(getAllPersons);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
}

export async function refreshToken(req: Request, res: Response) {
  try {
    const cookies = cookie.parse(req.headers.cookie || ""); // Parse cookies from header string
    const refreshTokenFromCookie = cookies.refreshToken;

    if (!refreshTokenFromCookie) {
      throw new Error("Refresh token is missing");
    }

    // Step 3: Generate new access token using the refresh token
    const { accessToken } = await AuthenticationService.refreshToken({
      token: refreshTokenFromCookie,
    });

    // Step 4: Set the new access token in response cookies
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict", // Prevent CSRF attacks
        maxAge: 15 * 60,
      })
    );

    res.status(200).send({ message: "Access token refreshed successfully" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
}
