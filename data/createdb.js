// Script para crear y poblar la base de datos SQLite.
// Ejecutar con:  npm run db:create   (o)   node data/createdb.js
import { cwd } from "node:process";
import { seedDatabase } from "./seed.js";

const total = seedDatabase();
console.log(`Base de datos creada en ${cwd()}/data/discos.db`);
console.log(`Albumes insertados: ${total}`);
