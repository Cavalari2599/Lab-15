-- Esquema de la base de datos del catalogo de albumes.
-- Se elimina la tabla previa para que poblar la BD sea idempotente
-- (se puede ejecutar el seed las veces que haga falta).
DROP TABLE IF EXISTS albumes;

CREATE TABLE albumes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT NOT NULL,
  artista TEXT NOT NULL,
  genero TEXT NOT NULL,
  anio INTEGER NOT NULL,
  sello TEXT NOT NULL,
  pistas INTEGER NOT NULL,
  imagen TEXT,
  slug TEXT UNIQUE NOT NULL,
  resumen TEXT,
  descripcion TEXT
);
