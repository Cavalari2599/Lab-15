// GET /search/:text -> busca albumes por texto. Valida la entrada con Zod.
// Devuelve 400 si el texto no cumple las reglas (minimo 3 caracteres).
import { z } from "zod";
import * as albumes from "../../data/albumes.js";
import { badRequest } from "../../utils/responses.js";

const schema = z.object({
  text: z
    .string()
    .trim()
    .min(3, "La busqueda debe tener al menos 3 caracteres")
    .max(50, "La busqueda no puede superar los 50 caracteres")
    .transform((value) => value.toLowerCase())
});

export const search = (req, res) => {
  const parsed = schema.safeParse(req.params);

  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Busqueda invalida";
    return badRequest(res, message);
  }

  const resultados = albumes.search(parsed.data.text);
  res.json(resultados);
};
