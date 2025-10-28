import { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import { ZodError } from "zod";
import { loginSchema, signupSchema } from "../validators/auth.validator.js"; 

export const signup = async (req: Request, res: Response) => { 
    try {
        const validatedData = signupSchema.parse(req.body);

        const { fullName, email, password } = validatedData;
        
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(409).json({ message: "Email already in use" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await prisma.user.create({
            data: {
                fullName,
                email,
                password: hashedPassword,
            },
        });
        
        if (newUser) {
            generateToken(newUser.id, res);

            res.status(201).json({
                id: newUser.id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });
        } else {
            res.status(400).json({ message: 'Invalid User data' });
        }
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                message: "Validation failed",
                errors: error.flatten().fieldErrors 
            });
        }
        console.error("Error in signup controller:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const login = async (req: Request, res: Response) => {
    try {
        const validatedData = loginSchema.parse(req.body);
        const { email, password } = validatedData;

        const user = await prisma.user.findUnique({
            where: { email }
        });

        const isPasswordCorrect = user ? await bcrypt.compare(password, user.password) : false;

        if (!user || !isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid credentials" }); // 401 Unauthorized
        }


        generateToken(user.id, res);

        res.status(200).json({
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });

    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                message: "Validation failed",
                errors: error.flatten().fieldErrors
            });
        }
        console.error("Error in login controller:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const logout = (req: Request, res: Response) => {
    try {
        res.cookie("jwt", "", {
            maxAge: 0 
        });

        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Error in logout controller:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};