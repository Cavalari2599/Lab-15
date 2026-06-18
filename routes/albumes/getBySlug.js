// GET /album/:slug -> detalle de un album. 404 si no existe.
import * as albumes from "../../data/albumes.js";
import { notFound } from "../../utils/responses.js";

export const getBySlug = (req, res) => {
  const album = albumes.getBySlug(req.params.slug);
  if (!album) return notFound(res, "No existe ese album");
  res.json(album);
};
