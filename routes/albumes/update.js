// PUT /album/:slug -> actualiza un album existente.
// 404 si no existe, 400 si el cuerpo no es valido (Zod),
// 200 con el album actualizado si todo sale bien. El slug no cambia.
import { albumSchema } from "./schema.js";
import * as albumes from "../../data/albumes.js";
import { badRequest, notFound } from "../../utils/responses.js";

export const update = (req, res) => {
  const { slug } = req.params;

  if (!albumes.getBySlug(slug)) return notFound(res, "No existe ese album");

  const parsed = albumSchema.safeParse(req.body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Datos del album invalidos";
    return badRequest(res, message);
  }

  const album = albumes.update(slug, parsed.data);
  res.json(album);
};
