import { GoogleGenAI } from "@google/genai";

/**
 * Inicializa o cliente da Gemini API de forma segura.
 * Utiliza process.env.API_KEY conforme diretrizes obrigatórias.
 */
export const getAIClient = () => {
  // O SDK injeta automaticamente a chave se disponível no ambiente
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.warn("Luna: API Key não detectada. Funcionalidades de IA estarão limitadas.");
    return null;
  }

  try {
    return new GoogleGenAI({ apiKey });
  } catch (error) {
    console.error("Luna: Erro crítico ao inicializar o motor de IA:", error);
    return null;
  }
};

export const ai = getAIClient();
