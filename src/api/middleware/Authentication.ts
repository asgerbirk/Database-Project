import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_TOKEN;

//MIddleware to authenticate a user based on JWT token
//Extracts the token from the authrorization header
//verify token with secret key
//decods the token so we get the user data.
export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid token" });
  }
}

// Middleware to authorize a user based on their role.
//Accepts an array of allowed roles.
//Checks the role of the authenticated user attached to the request object.
//
export function authorizeRoles(allowedRoles: Array<"ADMIN" | "MEMBER">) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    if (!allowedRoles.includes(user.role)) {
      return res
        .status(403)
        .json({ error: "You do not have permission to perform this action" });
    }

    next();
  };
}
