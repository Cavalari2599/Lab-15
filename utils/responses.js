// Helpers para respuestas de error con formato JSON consistente.
export const notFound = (res, message = "Recurso no encontrado") =>
  res.status(404).json({ error: message });

export const badRequest = (res, message = "Peticion invalida") =>
  res.status(400).json({ error: message });

export const conflict = (res, message = "El recurso ya existe") =>
  res.status(409).json({ error: message });
