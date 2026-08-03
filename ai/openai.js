require("dotenv").config();

const OpenAI = require("openai");
const prompt = require("./prompt");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateReply(history, memory, latestMessage) {
  const transcript = history
    .map((message) => {
      const speaker = message.sender === "me" ? "Me" : "Her";
      return `${speaker}: ${message.text}`;
    })
    .join("\n");

  const memoryPrompt = memory.toPrompt();

  const response = await client.responses.create({
    model: "gpt-5.4-mini",
    input: `${prompt}

${memoryPrompt}

Conversation so far:

${transcript}

Latest message:
Her: ${latestMessage.text}

Reply as Me with only the next Instagram message.`,
  });

  return response.output_text.trim();
}

module.exports = {
  generateReply,
};
