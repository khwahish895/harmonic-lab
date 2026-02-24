import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { TheoryResponse } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getTheoryAnalysis(prompt: string): Promise<TheoryResponse> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
    config: {
      systemInstruction: `You are an expert music theorist. 
      Analyze the user's request and provide a structured response.
      If they ask for a scale or chord, provide the notes and intervals.
      Notes should use standard notation (e.g., C, C#, Db, D).
      Return the data in JSON format.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          scale: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              root: { type: Type.STRING },
              notes: { type: Type.ARRAY, items: { type: Type.STRING } },
              intervals: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["name", "root", "notes", "intervals"],
          },
          chord: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              root: { type: Type.STRING },
              notes: { type: Type.ARRAY, items: { type: Type.STRING } },
              type: { type: Type.STRING },
            },
            required: ["name", "root", "notes", "type"],
          },
          explanation: { type: Type.STRING },
          suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["explanation", "suggestions"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
}

export async function generateMusicImage(prompt: string, size: "1K" | "2K" | "4K" = "1K") {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-image-preview",
    contents: {
      parts: [{ text: `A high-quality artistic visualization of this musical concept: ${prompt}. Cinematic lighting, abstract musical elements.` }],
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9",
        imageSize: size,
      },
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
}
