
import { GoogleGenAI } from "@google/genai";
import { INITIAL_NEWSLETTER_PROMPT } from "../constants";

export const generateExecutiveSummary = async (rawContent: string): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please ensure it is set in the environment.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `${INITIAL_NEWSLETTER_PROMPT}\n\nRAW WEEKLY DATA:\n${rawContent}`,
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });

    return response.text || "Failed to generate summary.";
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    return "Error generating summary. Please check your data and try again.";
  }
};
