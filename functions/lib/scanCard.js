"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanCard = void 0;
const https_1 = require("firebase-functions/v2/https");
const params_1 = require("firebase-functions/params");
const geminiApiKey = (0, params_1.defineSecret)("GEMINI_API_KEY");
/**
 * Función para escanear los datos de una carta TCG usando Gemini 2.0 Flash
 */
exports.scanCard = (0, https_1.onCall)({ secrets: [geminiApiKey] }, async (request) => {
    var _a, _b, _c, _d, _e;
    if (!request.auth) {
        throw new https_1.HttpsError("unauthenticated", "Debes estar autenticado.");
    }
    const { imageBase64, mediaType } = request.data;
    if (!imageBase64 || !mediaType) {
        throw new https_1.HttpsError("invalid-argument", "Imagen o tipo de medio faltantes.");
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
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                        parts: [
                            { inline_data: { mime_type: mediaType, data: imageBase64 } },
                            { text: prompt },
                        ],
                    }],
                generationConfig: { temperature: 0.1, maxOutputTokens: 1000 },
            }),
        });
        if (!response.ok) {
            const errorDetail = await response.json();
            console.error("Gemini API Error Detail:", JSON.stringify(errorDetail));
            throw new https_1.HttpsError("internal", `Google API Error: ${response.status}`);
        }
        const data = await response.json();
        const text = ((_e = (_d = (_c = (_b = (_a = data.candidates) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.parts) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.text) || "{}";
        const cleanJson = text.replace(/```json|```/g, "").trim();
        return JSON.parse(cleanJson);
    }
    catch (error) {
        if (error instanceof https_1.HttpsError)
            throw error;
        console.error("scanCard Exception:", error);
        throw new https_1.HttpsError("internal", "No se pudo analizar la imagen.");
    }
});
//# sourceMappingURL=scanCard.js.map