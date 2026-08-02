require("dotenv").config();

const OpenAI = require("openai");
const prompt = require("./prompt");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateReply(message) {
  const response = await client.responses.create({
    model: "gpt-5.4-mini",
    input: [
      {
        role: "system",
        content: prompt,
      },
      {
        role: "user",
        content: message,
      },
    ],
  });

  return response.output_text.trim();
}

module.exports = {
  generateReply,
};
