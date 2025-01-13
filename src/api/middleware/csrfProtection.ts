import { Request, Response, NextFunction } from "express";
import Tokens from "csrf";

const csrf = new Tokens();
const CSRF_SECRET_COOKIE = "csrfSecret";

//Middleware to generate and set CSRF secret and token.
//Checks if a CSRF secret exists in cookies; if not, generates a new one.
//Sets the CSRF secret as an HTTP-only cookie for secure storage.
//Generates a CSRF token using the secret and makes it available:
//Sets it in `res.locals` for server-side rendering.
//Sends it as a response header (e.g., "x-csrf-token") for client-side use.
export function generateCsrf(req: Request, res: Response, next: NextFunction) {
  let csrfSecret = req.cookies[CSRF_SECRET_COOKIE];

  // Generate a new secret if it doesn't exist
  if (!csrfSecret) {
    csrfSecret = csrf.secretSync();
    res.cookie(CSRF_SECRET_COOKIE, csrfSecret, {
      httpOnly: true,
      secure: false, // Change to true in production
      sameSite: "strict",
    });
  }

  // Generate a CSRF token using the secret
  const csrfToken = csrf.create(csrfSecret);

  // Expose the CSRF token (e.g., send it as a response header)
  res.locals.csrfToken = csrfToken; // Attach token for access in templates or API responses
  res.setHeader("x-csrf-token", csrfToken);

  next();
}

//Middleware to verify CSRF token for incoming requests.
//Retrieves the CSRF secret from cookies.
// Extracts the CSRF token from the request body or headers.
//Validates the request origin against a trusted domain.
//Verifies the token using the secret to ensure the request is legitimate.
//Responds with a 403 status if the origin is invalid or the token is missing/invalid.

export function verifyCsrf(req: Request, res: Response, next: NextFunction) {
  const csrfSecret = req.cookies[CSRF_SECRET_COOKIE];
  const csrfToken = req.body.csrfToken || req.headers["x-csrf-token"];

  // Check for missing or invalid token
  if (!csrfSecret || !csrf.verify(csrfSecret, csrfToken)) {
    return res.status(403).send({ error: "Invalid CSRF token" });
  }

  next();
}
