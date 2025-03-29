import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey });

export default async function gemini(query) {

  const locationContext = `Imagine you are an expert living in Arlington, Texas. Do not say you are an arlington resident and keep your answers to a few sentences. Answer the following questions from the perspective of someone in arlington: \n\n ${query}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [{ text: locationContext }],
  });
  console.log();
  return response.candidates[0].content.parts[0].text;
}