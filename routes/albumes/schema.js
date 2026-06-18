// Esquema Zod del cuerpo de un album. Se usa al crear (POST) y al actualizar (PUT).
// El slug NO va en el cuerpo: se genera a partir del titulo.
import { z } from "zod";

export const albumSchema = z.object({
  titulo: z.string().trim().min(1, "El titulo es obligatorio").max(120),
  artista: z.string().trim().min(1, "El artista es obligatorio").max(120),
  genero: z.string().trim().min(1, "El genero es obligatorio").max(60),
  anio: z
    .number()
    .int("El anio debe ser un numero entero")
    .min(1900, "El anio debe ser 1900 o posterior")
    .max(2100, "El anio no puede superar 2100"),
  sello: z.string().trim().min(1, "El sello es obligatorio").max(120),
  pistas: z
    .number()
    .int("Las pistas deben ser un numero entero")
    .positive("Las pistas deben ser un entero positivo")
    .max(500, "Demasiadas pistas"),
  imagen: z.string().trim().max(200).optional(),
  resumen: z.string().trim().max(280).optional(),
  descripcion: z.string().trim().max(1000).optional()
});
