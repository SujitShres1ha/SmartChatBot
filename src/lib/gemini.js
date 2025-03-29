import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey });

export default async function gemini(messages) {
  try {
    // Format context with sender roles
    const locationContext = `Imagine you are a friendly and knowledgeable expert living in Arlington, Texas. Answer the following questions with honesty and keep your responses concise. Provide helpful and accurate information based on your local expertise. The user responses are for your reference only. Limit your response under 100 words.\n\n`;
    const formattedMessages = messages.map((message) =>
      `${message.text}`
    ).join("\n");

    const context =  `${locationContext}${formattedMessages}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ text: context }],
    });

    return response.candidates[0].content.parts[0].text; // Extract bot's response
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Failed to fetch response from Gemini API.");
  }
}
