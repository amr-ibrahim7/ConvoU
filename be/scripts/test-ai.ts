import { HfInference } from "@huggingface/inference";
import dotenv from "dotenv";

dotenv.config();

const hf = new HfInference(process.env.HUGGINGFACE_TOKEN);

const testConversation = `
John: Hey Sarah, how's the new feature coming along?
Sarah: It's going well! I finished the UI design yesterday.
John: That's great! Any blockers?
Sarah: Just waiting for API documentation from the backend team.
John: I'll follow up with them today. Let's aim to have this done by Friday.
Sarah: Sounds good! I'm excited about this release.
`;

// const testConversation = `
// John: Sarah, why isn't that feature finished yet? The deadline is approaching.
// Sarah: I'm working on it. The UI design is complete.
// John: The design? That's it? This is completely unacceptable. What's the problem?
// Sarah: I can't proceed without the API documentation. I've been waiting for it.
// John: Waiting is not part of your job description. This is your responsibility to solve. I don't want to hear excuses, I want to see results. I'm making it clear: if this isn't deployed by Friday, there will be consequences.
// Sarah: ...Okay, I understand.
// `;


const promptedConversation = `Summarize the key points of the following conversation in a single short paragraph:\n\n${testConversation}`;

async function testSummarization() {
  console.log("Testing Summarization with Prompt...\n");
  
  try {
    const response = await hf.summarization({
      model: 'facebook/bart-large-cnn',
      inputs: promptedConversation,
      parameters: {
        max_length: 100,
        min_length: 30,
        do_sample: false
      }
    });

    console.log("Summary:");
    console.log(response.summary_text);
    console.log("\n" + "=".repeat(50) + "\n");
  } catch (error: any) {
    console.error("Summarization failed:");
    console.error(error.message);
    console.log("\n" + "=".repeat(50) + "\n");
  }
}

async function testSentiment() {
  console.log("Testing Sentiment Analysis...\n");
  
  try {
    const response = await hf.textClassification({
      model: 'distilbert-base-uncased-finetuned-sst-2-english',
      inputs: testConversation, 
    });

    console.log("Sentiment Results:");
    response.forEach(result => {
      console.log(`${result.label}: ${(result.score * 100).toFixed(2)}%`);
    });
    console.log("\n" + "=".repeat(50) + "\n");
  } catch (error: any) {
    console.error("Sentiment analysis failed:");
    console.error(error.message);
    console.log("\n" + "=".repeat(50) + "\n");
  }
}


async function runTests() {
  console.log("\n" + "=".repeat(50));
  console.log("Starting AI Model Tests");
  console.log("=".repeat(50) + "\n");

  if (!process.env.HUGGINGFACE_TOKEN) {
    console.error("HUGGINGFACE_TOKEN not found in .env file!");
    process.exit(1);
  }

  console.log("Token found, proceeding with tests...\n");

  await testSummarization();
  await testSentiment();
 

  console.log("=".repeat(50));
  console.log("Tests completed!");
  console.log("=".repeat(50));
}

runTests().catch(console.error);