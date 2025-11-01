import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import { User } from "@prisma/client";


export type UserWithoutPassword = Omit<User, "password">;


export interface AuthRequest extends Request {
  user?: UserWithoutPassword;
}


interface DecodedToken extends JwtPayload {
  userId: string;
}

export const protectRoute = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        profilePic: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;

    next();
  } catch (error: any) {
    console.log("Error in protectRoute middleware: ", error.message);
    if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }
    if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Unauthorized - Token Expired" });
    }
    
    res.status(500).json({ message: "Internal Server Error" });
  }
};