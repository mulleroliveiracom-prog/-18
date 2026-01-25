import { GoogleGenAI } from "@google/genai";

/**
 * Inicialização centralizada da Gemini AI.
 * Guideline: O API Key deve ser obtido exclusivamente de process.env.API_KEY e usado diretamente.
 * Fix: Use process.env.API_KEY string directly as a named parameter without fallback.
 */
export const ai = new GoogleGenAI({ 
  apiKey: process.env.API_KEY 
});
