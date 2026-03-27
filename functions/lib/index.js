"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanCard = void 0;
const v2_1 = require("firebase-functions/v2");
const scanCard_1 = require("./scanCard");
Object.defineProperty(exports, "scanCard", { enumerable: true, get: function () { return scanCard_1.scanCard; } });
// Configuración global (ej: máximo de instancias para ahorrar costos)
(0, v2_1.setGlobalOptions)({
    maxInstances: 10,
    region: "us-central1",
});
//# sourceMappingURL=index.js.map