import { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import { ZodError } from "zod";
import { loginSchema, signupSchema, updatePasswordSchema } from "../validators/auth.validator.js"; 
import cloudinary from "../lib/cloudinary.js";

import { AuthRequest } from "../middleware/auth.middleware.js";


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



/**
 * @description Update user's profile (fullName and/or profilePic)
 * @route PUT /api/users/update
 * @access Private
 */
export const updateProfile = async (req: AuthRequest, res: Response) => {
    try {
      const { fullName } = req.body;
      const file = req.file;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized access" });
      }
  
      let newProfilePicUrl: string | undefined;


      if (file) {
        const b64 = Buffer.from(file.buffer).toString("base64");
        const dataURI = "data:" + file.mimetype + ";base64," + b64;
        
        const uploadResponse = await cloudinary.uploader.upload(dataURI, {
          folder: "vconnct_profiles",
          resource_type: "auto",
        });
        newProfilePicUrl = uploadResponse.secure_url;
      }


      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          fullName: fullName || undefined,
          profilePic: newProfilePicUrl || undefined,
        },
        select: {
          id: true,
          fullName: true,
          email: true,
          profilePic: true,
          createdAt: true,
          updatedAt: true,
        },
      });
  
      res.status(200).json(updatedUser);
  
    } catch (error) {
      console.error("Error in updateProfile controller:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  /**
   * @description Get the profile of the currently logged-in user
   * @route GET /api/users/me
   * @access Private
   */
  export const getMyProfile = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          fullName: true,
          email: true,
          profilePic: true,
          createdAt: true,
          updatedAt: true,
        },
      });
  
      if (!user) return res.status(404).json({ message: "User not found" });
  
      res.status(200).json(user);
    } catch (error) {
      console.error("Error in getMyProfile controller:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  


/**
 * @description Update user's password after verifying the current one
 * @route PUT /api/users/update-password
 * @access Private
 */
export const updatePassword = async (req: AuthRequest, res: Response) => {
    try {
      const { currentPassword, newPassword } = updatePasswordSchema.parse(req.body);
      const userId = req.user?.id;
  
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
  
      if (!isPasswordCorrect) {
        return res.status(401).json({ message: "Incorrect current password" });
      }

      const salt = await bcrypt.genSalt(10);
      const newHashedPassword = await bcrypt.hash(newPassword, salt);
  
      await prisma.user.update({
        where: { id: userId },
        data: { password: newHashedPassword },
      });
  
      res.status(200).json({ message: "Password updated successfully" });
  
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Validation failed",
          errors: error.flatten().fieldErrors,
        });
      }
      console.error("Error in updatePassword controller:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };


  export const checkAuth = async (req: AuthRequest, res: Response) => {
    try {
      res.status(200).json(req.user);
      
    } catch (error) {

      console.error("Error in checkAuth controller:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };