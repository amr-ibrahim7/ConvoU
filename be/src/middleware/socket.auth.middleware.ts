import { Socket } from "socket.io";
import jwt, { JwtPayload } from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import { User } from "@prisma/client";


export interface AuthenticatedSocket extends Socket {
  user?: Omit<User, "password">;
}

interface DecodedToken extends JwtPayload {
  userId: string;
}

type SocketNextFunction = (err?: Error) => void;

export const socketAuthMiddleware = async (socket: AuthenticatedSocket, next: SocketNextFunction) => {
  try {
    const cookieString = socket.handshake.headers.cookie || "";
    const token = cookieString
      .split("; ")
      .find((row) => row.startsWith("jwt="))
      ?.split("=")[1];

    if (!token) {
      console.log("Socket connection rejected: No token provided");
      return next(new Error("Unauthorized: No Token Provided"));
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
      console.log("Socket connection rejected: User not found");
      return next(new Error("Unauthorized: User not found"));
    }

    socket.user = user;
    
    console.log(`Socket authenticated for user: ${user.fullName} (ID: ${user.id})`);
    next();
  } catch (error: any) {
    console.log("Error in socket authentication:", error.message);
    if (error.name === "JsonWebTokenError") {
      return next(new Error("Unauthorized: Invalid Token"));
    }
    if (error.name === "TokenExpiredError") {
      return next(new Error("Unauthorized: Token Expired"));
    }
    next(new Error("Unauthorized: Authentication failed"));
  }
};