import { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import { HfInference } from "@huggingface/inference";


const hf = new HfInference(process.env.HUGGINGFACE_TOKEN);


const MOCK_SUMMARY = "This was a productive conversation about the project deadline. Key decisions were made regarding the feature scope, and a follow-up meeting was scheduled for next week.";
const MOCK_SENTIMENTS = ["Positive", "Neutral", "Negative"];

export const generateInsight = async (req: Request, res: Response) => {
  const { conversationId } = req.params;

  try {
    let insight = await prisma.insight.findUnique({ where: { conversationId } });
    if (insight) {
      return res.status(200).json(insight);
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      include: { sender: { select: { fullName: true } } },
    });

    if (messages.length === 0) {
      return res.status(400).json({ message: "Cannot generate insights for an empty conversation." });
    }

    const conversationText = messages
      .map(msg => `${msg.sender.fullName}: ${msg.text || '[Image]'}`)
      .join('\n');

    let summary = MOCK_SUMMARY;
    let sentiment: "Positive" | "Negative" | "Neutral" = "Neutral";


    try {
      if (!process.env.HUGGINGFACE_TOKEN) {
        console.log("Hugging Face token not found. Using mock data.");
        throw new Error("Using mock data.");
      }

   
      const summaryResponse = await hf.summarization({
        model: 'facebook/bart-large-cnn',
        inputs: conversationText,
        parameters: { max_length: 50, min_length: 10 }
      });
      if (summaryResponse.summary_text) {
        summary = summaryResponse.summary_text;
        console.log("✅ Successfully generated summary from Hugging Face.");
      }

      const sentimentResponse = await hf.textClassification({
        model: 'distilbert-base-uncased-finetuned-sst-2-english',
        inputs: conversationText,
      });
      

      const topSentiment = sentimentResponse.sort((a, b) => b.score - a.score)[0];
      if (topSentiment) {
        if (topSentiment.label === 'POSITIVE') sentiment = 'Positive';
        else if (topSentiment.label === 'NEGATIVE') sentiment = 'Negative';
        else sentiment = 'Neutral';
        console.log("✅ Successfully generated sentiment from Hugging Face.");
      }

    } catch (error: any) {
-
      console.error("Hugging Face API call failed, using mock data as fallback. Error:", error.message);

      sentiment = MOCK_SENTIMENTS[Math.floor(Math.random() * MOCK_SENTIMENTS.length)] as "Positive" | "Negative" | "Neutral";
    }


    const newInsight = await prisma.insight.create({
      data: {
        conversationId,
        summary,
        sentiment,
      },
    });

    res.status(201).json(newInsight);
  } catch (error) {
    console.error("Error in generateInsight controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};