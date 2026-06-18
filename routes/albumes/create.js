// POST /albumes -> crea un album nuevo.
// 400 si el cuerpo no es valido (Zod), 409 si ya existe el slug,
// 201 con cabecera Location si se crea correctamente.
import { albumSchema } from "./schema.js";
import { slugify } from "../../utils/slug.js";
import * as albumes from "../../data/albumes.js";
import { badRequest, conflict } from "../../utils/responses.js";

export const create = (req, res) => {
  const parsed = albumSchema.safeParse(req.body);

  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Datos del album invalidos";
    return badRequest(res, message);
  }

  // El slug se genera a partir del titulo.
  const slug = slugify(parsed.data.titulo);
  if (albumes.getBySlug(slug))
    return conflict(res, `Ya existe un album con el slug: ${slug}`);

  const album = albumes.create({ ...parsed.data, slug });
  res.status(201).location(`/album/${slug}`).json(album);
};
