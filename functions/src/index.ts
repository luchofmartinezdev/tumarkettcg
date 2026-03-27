import {setGlobalOptions} from "firebase-functions/v2";
import {scanCard} from "./scanCard";

// Configuración global (ej: máximo de instancias para ahorrar costos)
setGlobalOptions({
  maxInstances: 10,
  region: "us-central1",
});

export {scanCard};
