// Repositorio: acceso a los datos de los albumes en SQLite.
// Todas las consultas usan db.prepare() con parametros para evitar inyeccion SQL.
import { DatabaseSync } from "node:sqlite";
import { cwd } from "node:process";

const db = new DatabaseSync(`${cwd()}/data/discos.db`);

// Devuelve solo los slugs (lista ligera).
export const getAllSlugs = () => {
  const query = db.prepare("SELECT slug FROM albumes ORDER BY anio DESC");
  return query.all().map((row) => row.slug);
};

// Devuelve todos los albumes con todos sus campos.
export const getAllFull = () => {
  const query = db.prepare("SELECT * FROM albumes ORDER BY anio DESC");
  return query.all();
};

// Devuelve un album por su slug (o undefined si no existe).
export const getBySlug = (slug) => {
  const query = db.prepare("SELECT * FROM albumes WHERE slug = ?");
  return query.get(slug);
};

// Devuelve los slugs de los albumes de un genero (sin distinguir mayusculas).
export const getSlugsByGenre = (genero) => {
  const query = db.prepare(
    "SELECT slug FROM albumes WHERE genero = ? COLLATE NOCASE ORDER BY anio DESC"
  );
  return query.all(genero).map((row) => row.slug);
};

// Busca texto en varios campos y devuelve los albumes coincidentes.
export const search = (text) => {
  const query = db.prepare(`
    SELECT * FROM albumes
    WHERE titulo LIKE :q COLLATE NOCASE
       OR artista LIKE :q COLLATE NOCASE
       OR genero LIKE :q COLLATE NOCASE
       OR sello LIKE :q COLLATE NOCASE
       OR resumen LIKE :q COLLATE NOCASE
       OR descripcion LIKE :q COLLATE NOCASE
    ORDER BY anio DESC
  `);
  return query.all({ q: `%${text}%` });
};

// Inserta un album nuevo y lo devuelve ya guardado.
export const create = (album) => {
  const insert = db.prepare(`
    INSERT INTO albumes
      (titulo, artista, genero, anio, sello, pistas, imagen, slug, resumen, descripcion)
    VALUES
      (:titulo, :artista, :genero, :anio, :sello, :pistas, :imagen, :slug, :resumen, :descripcion)
  `);
  insert.run({
    titulo: album.titulo,
    artista: album.artista,
    genero: album.genero,
    anio: album.anio,
    sello: album.sello,
    pistas: album.pistas,
    imagen: album.imagen ?? null,
    slug: album.slug,
    resumen: album.resumen ?? null,
    descripcion: album.descripcion ?? null
  });
  return getBySlug(album.slug);
};

// Actualiza los datos de un album existente (el slug no cambia) y lo devuelve.
export const update = (slug, album) => {
  const stmt = db.prepare(`
    UPDATE albumes SET
      titulo = :titulo,
      artista = :artista,
      genero = :genero,
      anio = :anio,
      sello = :sello,
      pistas = :pistas,
      imagen = :imagen,
      resumen = :resumen,
      descripcion = :descripcion
    WHERE slug = :slug
  `);
  stmt.run({
    titulo: album.titulo,
    artista: album.artista,
    genero: album.genero,
    anio: album.anio,
    sello: album.sello,
    pistas: album.pistas,
    imagen: album.imagen ?? null,
    resumen: album.resumen ?? null,
    descripcion: album.descripcion ?? null,
    slug
  });
  return getBySlug(slug);
};

// Elimina un album por su slug. Devuelve true si borro algo.
export const remove = (slug) => {
  const stmt = db.prepare("DELETE FROM albumes WHERE slug = ?");
  const result = stmt.run(slug);
  return result.changes > 0;
};
