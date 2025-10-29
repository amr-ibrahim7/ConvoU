import { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import cloudinary from "../lib/cloudinary.js";


interface AuthRequest extends Request {
    user?: {
      id: string;
    };
}

export const getAllContacts = async (req: AuthRequest, res: Response) => {
    try{
        const loggedInUserId = req.user?.id;
        if (!loggedInUserId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const users = await prisma.user.findMany({
            where: {
                id: {
                    not: loggedInUserId,
                },
            },
            select: {
                id: true,
                fullName: true,
                profilePic: true,
            },
        });

        res.status(200).json(users);
    } catch(error) {
        console.log("Error in getAll Contacts", error);
        res.status(500).json({message: "Server Error"})
        
    }
}


export const getMessages = async (req: AuthRequest, res: Response) => {
    try {
        const { id: otherUserId } = req.params;
        const loggedInUserId = req.user?.id;

        if (!loggedInUserId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const conversation = await prisma.conversation.findFirst({
            where: {
                AND: [
                    { participants: { some: { id: loggedInUserId } } },
                    { participants: { some: { id: otherUserId } } },
                ],
            },
        });

        if (!conversation) {
            return res.status(200).json([]);
        }

  
        const messages = await prisma.message.findMany({
            where: {
                conversationId: conversation.id,
            },
            orderBy: {
                createdAt: "asc",
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        fullName: true,
                        profilePic: true,
                    }
                }
            }
        });

        res.status(200).json(messages);

    } catch (error) {
        console.log("Error in getMessages controller: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



export const sendMessage = async (req: AuthRequest, res: Response) => {
    try {
        const { text } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user?.id;
        const file = req.file;

        if (!senderId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!text && !file) {
            return res.status(400).json({ message: "Cannot send an empty message" });
        }

        let imageUrl: string | undefined;


        if (file) {
   
            const b64 = Buffer.from(file.buffer).toString("base64");
            const dataURI = "data:" + file.mimetype + ";base64," + b64;

            const uploadResponse = await cloudinary.uploader.upload(dataURI, {
                folder: "vconnct_messages",
                resource_type: "auto",
            });
            imageUrl = uploadResponse.secure_url;
        }
        
        let conversation = await prisma.conversation.findFirst({
            where: {
                AND: [
                    { participants: { some: { id: senderId } } },
                    { participants: { some: { id: receiverId } } },
                ],
            },
        });

        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: {
                    participants: {
                        connect: [{ id: senderId }, { id: receiverId }],
                    },
                },
            });
        }


        const newMessage = await prisma.message.create({
            data: {
                senderId: senderId,
                conversationId: conversation.id,
                text: text || undefined,
                image: imageUrl || undefined,
            },
            include: {
                sender: {
                    select: { id: true, fullName: true, profilePic: true }
                },
                conversation: {
                    include: {
                        participants: { 
                            select: { id: true, fullName: true, profilePic: true }
                        }
                    }
                }
            }
        });

        // todo :send message in real time if user is online - socket-io

        res.status(201).json(newMessage);

    } catch (error) {
        console.log("Error in sendMessage controller: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



export const getConversations = async (req: AuthRequest, res: Response) => {
    try {
        const loggedInUserId = req.user?.id;
        if (!loggedInUserId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const conversations = await prisma.conversation.findMany({
            where: {
                participants: {
                    some: { id: loggedInUserId },
                },
            },
            include: {
                participants: {
                    select: {
                        id: true,
                        fullName: true,
                        profilePic: true,
                    },
                },
            
                messages: {
                    orderBy: {
                        createdAt: 'desc', 
                    },
                    take: 1,
                },
            },
        });


        const formattedConversations = conversations.map(conv => {
            const otherParticipant = conv.participants.find(p => p.id !== loggedInUserId);
            return {
                conversationId: conv.id,
                otherParticipant: otherParticipant,
                lastMessage: conv.messages[0] || null,
            };
        });

        res.status(200).json(formattedConversations);

    } catch (error) {
        console.log("Error in getConversations controller: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};