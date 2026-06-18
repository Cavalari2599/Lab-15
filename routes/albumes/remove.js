// DELETE /album/:slug -> elimina un album. 404 si no existe, 204 sin cuerpo si se borra.
import * as albumes from "../../data/albumes.js";
import { notFound } from "../../utils/responses.js";

export const remove = (req, res) => {
  const deleted = albumes.remove(req.params.slug);
  if (!deleted) return notFound(res, "No existe ese album");
  res.status(204).end();
};
