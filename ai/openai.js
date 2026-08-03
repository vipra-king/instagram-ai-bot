require("dotenv").config();
const fs = require("fs");
const OpenAI = require("openai");
const { retrieveExamples } = require("./retriever");
const PromptBuilder = require("./prompt-builder");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateReply(history, memory, latestMessage) {
  const relevantExamples = retrieveExamples(latestMessage, memory.examples, 5);
  console.log(
    "Retrieved Examples:",
    relevantExamples.map((e) => e.category),
  );
  const prompt = PromptBuilder.build({
    history,
    latestMessage,
    profile: memory.profile,
    style: memory.style,
    habits: memory.habits,
    phrases: memory.phrases,
    examples: relevantExamples,
  });
  fs.writeFileSync("last-prompt.txt", prompt);
  try {
    const response = await client.responses.create({
      model: "gpt-5.4-mini",
      input: prompt,
    });

    return response.output_text.trim();
  } catch (err) {
    console.error("OpenAI Error:", err);
    throw err;
  }
}

module.exports = {
  generateReply,
};
