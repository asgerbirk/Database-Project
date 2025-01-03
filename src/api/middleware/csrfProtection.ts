import { Request, Response, NextFunction } from "express";
import Tokens from "csrf";

const csrf = new Tokens();
const CSRF_SECRET_COOKIE = "csrfSecret";

// Middleware to generate and set CSRF secret and token
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

// Middleware to verify CSRF token
export function verifyCsrf(req: Request, res: Response, next: NextFunction) {
  const csrfSecret = req.cookies[CSRF_SECRET_COOKIE];
  const csrfToken = req.body.csrfToken || req.headers["x-csrf-token"];
  const origin = req.headers.origin || req.headers.referer;

  // Valider Origin
  if (!origin || !origin.startsWith("https://www.voreshjemmeside.com")) {
    return res.status(403).send({ error: "Invalid origin" });
  }

  // Check for missing or invalid token
  if (!csrfSecret || !csrf.verify(csrfSecret, csrfToken)) {
    return res.status(403).send({ error: "Invalid CSRF token" });
  }

  next();
}
