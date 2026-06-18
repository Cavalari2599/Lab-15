// GET /  -> informacion general de la API y sus rutas.
export const getInfo = (req, res) => {
  res.json({
    nombre: "API DiscoStore",
    descripcion:
      "API REST del catalogo de albumes de una tienda de musica. Node.js + Express + SQLite + Zod.",
    version: "1.0.0",
    endpoints: {
      "GET /": "Esta informacion.",
      "GET /albumes": "Lista de slugs. Usa ?include=full para ver todos los datos.",
      "POST /albumes": "Crea un album (el slug se genera del titulo).",
      "GET /album/:slug": "Detalle de un album por su slug.",
      "PUT /album/:slug": "Actualiza un album existente.",
      "DELETE /album/:slug": "Elimina un album.",
      "GET /genero/:genero": "Slugs de los albumes de ese genero.",
      "GET /search/:text": "Busca por texto (minimo 3 caracteres).",
      "GET /imagenes/:archivo": "Portadas de los albumes."
    }
  });
};
