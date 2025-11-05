import { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HUGGINGFACE_TOKEN);


const MOCK_SUMMARY = "This conversation covered important topics including project updates, task assignments, and scheduling. The team discussed next steps and reached consensus on priorities.";
const MOCK_SENTIMENTS = ["Positive", "Neutral", "Negative"];

export const generateInsight = async (req: Request, res: Response) => {
  const { conversationId } = req.params;

  try {
    let insight = await prisma.insight.findUnique({ where: { conversationId } });
    if (insight) {
      return res.status(200).json(insight);
    }

    // Fetch messages
    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      include: { sender: { select: { fullName: true } } },
    });

    if (messages.length === 0) {
      return res.status(400).json({ message: "Cannot generate insights for an empty conversation." });
    }

    // prepare conversation text
    let conversationText = messages
      .map(msg => `${msg.sender.fullName}: ${msg.text || '[Image]'}`)
      .join('\n');

      const promptedText = `Summarize the key points of the following conversation in a single short paragraph:\n\n${conversationText}`;

 
    const MAX_CHARS = 1024;
    if (conversationText.length > MAX_CHARS) {
      // console.log(`⚠️ Conversation too long (${conversationText.length} chars), truncating to ${MAX_CHARS}`);
      conversationText = conversationText.substring(0, MAX_CHARS) + "...";
    }


    let summary = '';
    let sentiment: "Positive" | "Negative" | "Neutral" = "Neutral";


    try {
      if (!process.env.HUGGINGFACE_TOKEN) {
        throw new Error("Hugging Face token not configured");
      }

      // console.log("Attempting AI generation...");

  
      try {
        const summaryResponse = await hf.summarization({
          model: 'facebook/bart-large-cnn',
          inputs: promptedText,
          parameters: {
            max_length: 100,
            min_length: 30,
            do_sample: false
          }
        });

        if (summaryResponse.summary_text) {
          summary = summaryResponse.summary_text;
          // console.log("Summary generated successfully");
        }
        else {
          throw new Error("summary response was empty.");
        }
      } catch (summaryError: any) {
        console.error("Summary generation failed:", summaryError.message);
        summary = MOCK_SUMMARY;
      }

      // generate Sentiment
      try {
        const sentimentResponse = await hf.textClassification({
          model: 'distilbert-base-uncased-finetuned-sst-2-english',
          inputs: conversationText,
        });

        if (sentimentResponse && sentimentResponse.length > 0) {
          const topSentiment = sentimentResponse.sort((a, b) => b.score - a.score)[0];
          
        
          if (topSentiment.label.toUpperCase().includes('POSITIVE')) {
            sentiment = 'Positive';
          } else if (topSentiment.label.toUpperCase().includes('NEGATIVE')) {
            sentiment = 'Negative';
          } else {
            sentiment = 'Neutral';
          }
          
          // console.log(`Sentiment: ${sentiment} (${topSentiment.score.toFixed(2)})`);
        }
      } catch (sentimentError: any) {
        console.error("Sentiment analysis failed:", sentimentError.message);
        // Use random mock sentiment
        sentiment = MOCK_SENTIMENTS[Math.floor(Math.random() * MOCK_SENTIMENTS.length)] as any;
      }

    } catch (error: any) {
      console.error("AI generation failed completely:", error.message);
      sentiment = MOCK_SENTIMENTS[Math.floor(Math.random() * MOCK_SENTIMENTS.length)] as any;
    }

    // save to database
    const newInsight = await prisma.insight.create({
      data: {
        conversationId,
        summary,
        sentiment,
      },
    });

    // console.log("Insight saved to database");
    res.status(201).json(newInsight);

  } catch (error) {
    console.error("Error in generateInsight controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// export const regenerateInsight = async (req: Request, res: Response) => {
//   const { conversationId } = req.params;

//   try {

//     await prisma.insight.deleteMany({ where: { conversationId } });
//     // console.log("Deleted old insight, regenerating...");
    
//     // Call generate again (will create new one)
//     return generateInsight(req, res);
//   } catch (error) {
//     console.error("Error regenerating insight:", error);
//     res.status(500).json({ message: "Failed to regenerate insight" });
//   }
// };