import { GoogleGenAI } from "@google/genai";

/**
 * Inicializa o cliente da Gemini API de forma segura.
 * Utiliza process.env.API_KEY conforme diretrizes de segurança.
 */
export const getAIClient = () => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.warn("Gemini API Key não encontrada. Verifique as variáveis de ambiente.");
    return null;
  }

  try {
    return new GoogleGenAI({ apiKey });
  } catch (error) {
    console.error("Erro ao inicializar GoogleGenAI:", error);
    return null;
  }
};

export const ai = getAIClient();
