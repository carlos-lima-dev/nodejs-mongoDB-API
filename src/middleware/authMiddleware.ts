import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY || "";

// Middleware to authenticate token and check roles
export function authenticateAndCheckRoles(roles: string[]) {
  return function (req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({error: "Unauthorized. No token provided"});
    }

    jwt.verify(token, SECRET_KEY, (err, user: any) => {
      if (err) {
        return res
          .status(403)
          .json({error: "Forbidden access. Invalid or expired token"});
      }

      // Attach the user info to the request object
      (req as any).user = user;

      // Check if the user has the required role
      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({
          error: "Forbidden access. User doesn't have the required role",
        });
      }

      next();
    });
  };
}
