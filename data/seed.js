// Crea la tabla y la puebla con los albumes de data.json.
// Lo usan el script createdb.js y la suite de pruebas.
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
import { cwd } from "node:process";

const DB_PATH = `${cwd()}/data/discos.db`;
const SCHEMA_PATH = `${cwd()}/data/schema.sql`;
const DATA_PATH = `${cwd()}/data/data.json`;

// Devuelve cuantos albumes quedaron insertados.
export const seedDatabase = () => {
  const db = new DatabaseSync(DB_PATH);

  // 1) Crear la tabla a partir del esquema (DROP + CREATE: idempotente).
  const schema = readFileSync(SCHEMA_PATH, "utf-8");
  db.exec(schema);

  // 2) Insertar cada album con una sentencia preparada (evita inyeccion SQL).
  const data = JSON.parse(readFileSync(DATA_PATH, "utf-8"));
  const insert = db.prepare(`
    INSERT INTO albumes
      (titulo, artista, genero, anio, sello, pistas, imagen, slug, resumen, descripcion)
    VALUES
      (:titulo, :artista, :genero, :anio, :sello, :pistas, :imagen, :slug, :resumen, :descripcion)
  `);
  for (const album of data) {
    insert.run(album);
  }

  const { total } = db.prepare("SELECT COUNT(*) AS total FROM albumes").get();
  db.close();
  return total;
};
