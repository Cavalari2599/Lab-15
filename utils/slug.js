// Genera un slug legible a partir de un texto (por ejemplo el titulo del album).
// "The Dark Side of the Moon" -> "the-dark-side-of-the-moon"
export const slugify = (text) =>
  text
    .normalize("NFD") // separa cada letra de su acento
    .replace(/\p{Diacritic}/gu, "") // elimina los acentos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-") // todo lo que no sea alfanumerico pasa a guion
    .replace(/^-+|-+$/g, ""); // quita los guiones sobrantes de los extremos
