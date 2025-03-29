import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey });

export default async function gemini(query) {

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [{ text: query }],
  });
  console.log();
  return response.candidates[0].content.parts[0].text;
}