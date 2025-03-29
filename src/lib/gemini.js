import { GoogleGenAI } from "@google/genai"

const apiKey = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey })

export default async function gemini() {
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: "Explain how AI works in a few words",
    });
    console.log(response.text)
}

