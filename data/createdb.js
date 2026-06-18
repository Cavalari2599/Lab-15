// Script para crear y poblar la base de datos SQLite.
// Ejecutar con:  npm run db:create   (o)   node data/createdb.js
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
import { cwd } from "node:process";
import data from "./data.json" with { type: "json" };

const DB_PATH = `${cwd()}/data/discos.db`;
const SCHEMA_PATH = `${cwd()}/data/schema.sql`;

const db = new DatabaseSync(DB_PATH);

// 1) Crear la tabla a partir del esquema.
const schema = readFileSync(SCHEMA_PATH, "utf-8");
db.exec(schema);

// 2) Insertar cada album con una sentencia preparada (evita inyeccion SQL).
const insert = db.prepare(`
  INSERT INTO albumes
    (titulo, artista, genero, anio, sello, pistas, imagen, slug, resumen, descripcion)
  VALUES
    (:titulo, :artista, :genero, :anio, :sello, :pistas, :imagen, :slug, :resumen, :descripcion)
`);

for (const album of data) {
  insert.run(album);
}

const total = db.prepare("SELECT COUNT(*) AS total FROM albumes").get();
console.log(`Base de datos creada en ${DB_PATH}`);
console.log(`Albumes insertados: ${total.total}`);

db.close();
