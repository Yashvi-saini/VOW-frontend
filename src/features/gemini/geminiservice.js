import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function askGemini(prompt) {
if (!genAI) throw new Error("Missing VITE_GEMINI_API_KEY");
  const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash-lite" });

  const result = await model.generateContent([prompt]);
  return await result.response.text();
}