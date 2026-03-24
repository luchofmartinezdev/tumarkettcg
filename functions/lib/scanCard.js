"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanCard = void 0;
const https_1 = require("firebase-functions/v2/https");
const params_1 = require("firebase-functions/params");
// Guardá tu API key de Google AI Studio como secret:
// firebase functions:secrets:set GEMINI_API_KEY
const geminiApiKey = (0, params_1.defineSecret)("GEMINI_API_KEY");
exports.scanCard = (0, https_1.onCall)({ secrets: [geminiApiKey] }, async (request) => {
    var _a, _b, _c, _d, _e;
    if (!request.auth) {
        throw new https_1.HttpsError("unauthenticated", "Debés estar logueado.");
    }
    const { imageBase64, mediaType } = request.data;
    if (!imageBase64 || !mediaType) {
        throw new https_1.HttpsError("invalid-argument", "Se requiere imageBase64 y mediaType.");
    }
    if (imageBase64.length > 5500000) {
        throw new https_1.HttpsError("invalid-argument", "La imagen es demasiado grande. Máximo 4MB.");
    }
    const prompt = `Analizá esta imagen de una carta coleccionable de TCG.

Respondé ÚNICAMENTE con un JSON válido, sin texto extra, sin markdown, sin backticks.

Estructura exacta a devolver:
{
  "cardName": "nombre exacto de la carta en el idioma que aparece impreso",
  "franchise": "uno de estos valores exactos: Pokémon | Magic | Yu-Gi-Oh! | One Piece | Dragon Ball Super | Lorcana | Digimon",
  "seriesName": "nombre de la serie o era (ej: Scarlet & Violet Series (2023-2025), Sword & Shield Series, Terastal Era JP (2024-2025)...)",
  "setName": "nombre del set o expansión específica (ej: Prismatic Evolutions, Temporal Forces, Surging Sparks...)",
  "cardNumber": "número de carta tal como aparece impreso (ej: 025/197, 151/204)",
  "rarity": "label de rareza visible (ej: Holo Rare (Rara Holo), Ultra Rare (UR), Secret Rare, Mythic Rare (Mítica - Bronce)...)",
  "condition": "uno de estos valores EXACTOS: Impecable (Mint) | Casi Nueva (NM) | Excelente (LP) | Usada (MP) | Muy Usada (HP) | Dañada (Poor)",
  "language": "uno de estos valores EXACTOS: Español | Inglés | Japonés | Portugués | Chino | Coreano | Italiano"
}

Criterios de condición:
- Impecable (Mint): Sin ninguna marca, esquinas y bordes perfectos
- Casi Nueva (NM): Desgaste mínimo apenas perceptible
- Excelente (LP): Pequeñas marcas en bordes o esquinas
- Usada (MP): Desgaste moderado y visible
- Muy Usada (HP): Daño significativo, dobleces o rayaduras importantes
- Dañada (Poor): Muy deteriorada, roturas o marcas severas

Si un dato no es visible, devolvé null. Para franchise, language y condition SOLO podés usar los valores listados arriba o null.`;
    try {
        // Gemini 2.0 Flash — gratis hasta 1500 req/día en Google AI Studio
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey.value()}`;
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                inline_data: {
                                    mime_type: mediaType,
                                    data: imageBase64,
                                },
                            },
                            { text: prompt },
                        ],
                    },
                ],
                generationConfig: {
                    temperature: 0.1, // Baja temperatura = respuestas más consistentes
                    maxOutputTokens: 1000,
                },
            }),
        });
        if (!response.ok) {
            const error = await response.json();
            console.error("Gemini API error:", error);
            throw new https_1.HttpsError("internal", "Error al contactar la IA.");
        }
        const data = await response.json();
        // Extraer el texto de la respuesta de Gemini
        const textContent = ((_e = (_d = (_c = (_b = (_a = data.candidates) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.parts) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.text) || "{}";
        const cleanJson = textContent.replace(/```json|```/g, "").trim();
        return JSON.parse(cleanJson);
    }
    catch (error) {
        if (error instanceof https_1.HttpsError)
            throw error;
        console.error("scanCard error:", error);
        throw new https_1.HttpsError("internal", "No se pudo analizar la carta.");
    }
});
//# sourceMappingURL=scanCard.js.map