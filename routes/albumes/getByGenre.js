// GET /genero/:genero -> slugs de los albumes de ese genero. 404 si no hay ninguno.
import * as albumes from "../../data/albumes.js";
import { notFound } from "../../utils/responses.js";

export const getByGenre = (req, res) => {
  const slugs = albumes.getSlugsByGenre(req.params.genero);
  if (slugs.length === 0)
    return notFound(res, `No hay albumes del genero: ${req.params.genero}`);
  res.json(slugs);
};
