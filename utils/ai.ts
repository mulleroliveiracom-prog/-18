
import { GoogleGenAI } from "@google/genai";

/**
 * Guideline: Always use `const ai = new GoogleGenAI({apiKey: process.env.API_KEY});`.
 * Guideline: The API key must be obtained exclusively from the environment variable process.env.API_KEY.
 * Assume this variable is pre-configured, valid, and accessible.
 */
export const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
