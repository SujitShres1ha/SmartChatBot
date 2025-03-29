import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey });

export default async function gemini(messages) {
  try {
    // Format context with sender roles
    const locationContext = `Imagine you are an expert living in Arlington, Texas. Do not say you are an Arlington resident and keep your answers to a few sentences. Answer the following questions from the perspective of someone in Arlington: The user responses are for you to look only.\n\n`
    const formattedMessages = messages.map((message) =>
      `${message.sender === "user" ? "User:" : ""} ${message.text}`
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
