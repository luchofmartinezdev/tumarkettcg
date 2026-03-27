import {onCall, HttpsError} from "firebase-functions/v2/https";
import {defineSecret} from "firebase-functions/params";

const geminiApiKey = defineSecret("GEMINI_API_KEY");

/**
 * Función para escanear los datos de una carta TCG usando Gemini 2.0 Flash
 */
export const scanCard = onCall({secrets: [geminiApiKey]}, async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Debes estar autenticado.");
  }

  const {imageBase64, mediaType} = request.data;
  if (!imageBase64 || !mediaType) {
    throw new HttpsError("invalid-argument",
      "Imagen o tipo de medio faltantes.");
  }

  const prompt = "Analizá esta imagen de una carta coleccionable de TCG. " +
    "Responde ÚNICAMENTE con un JSON con los campos: " +
    "{ \"cardName\", \"franchise\", \"seriesName\", \"setName\", " +
    "\"cardNumber\", \"rarity\", \"condition\", \"language\" }.";

  try {
    const baseUrl = "https://generativelanguage.googleapis.com/v1/models";
    const model = "gemini-1.5-flash:generateContent";
    const url = `${baseUrl}/${model}?key=${geminiApiKey.value()}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        contents: [{
          parts: [
            {inline_data: {mime_type: mediaType, data: imageBase64}},
            {text: prompt},
          ],
        }],
        generationConfig: {temperature: 0.1, maxOutputTokens: 1000},
      }),
    });

    if (!response.ok) {
      const errorDetail = await response.json();
      console.error("Gemini API Error Detail:", JSON.stringify(errorDetail));
      throw new HttpsError("internal", `Google API Error: ${response.status}`);
    }

    const data = await response.json() as {
      candidates?: {content?: {parts?: {text?: string}[]}}[]
    };
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    const cleanJson = text.replace(/```json|```/g, "").trim();

    return JSON.parse(cleanJson);
  } catch (error: unknown) {
    if (error instanceof HttpsError) throw error;
    console.error("scanCard Exception:", error);
    throw new HttpsError("internal", "No se pudo analizar la imagen.");
  }
});
