// Punto de entrada de la API de DiscoStore.
// Ejecutar con:  npm start   (o)   node index.js
import { loadEnvFile } from "node:process";
import { app } from "./app.js";

// Carga de variables de entorno desde .env (HOST, PORT).
try {
  loadEnvFile("./.env");
} catch {
  // Si no hay .env se usan los valores por defecto.
}

const HOST = process.env.HOST ?? "localhost";
const PORT = process.env.PORT ?? 4321;

app.listen(PORT, HOST, () => {
  console.log(`Servidor en http://${HOST}:${PORT}/`);
});
