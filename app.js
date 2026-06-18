// Aplicacion Express de DiscoStore (sin arrancar el servidor).
// Se separa de index.js para poder probarla con supertest.
import express from "express";

import { getInfo } from "./routes/albumes/getInfo.js";
import { getAll } from "./routes/albumes/getAll.js";
import { getBySlug } from "./routes/albumes/getBySlug.js";
import { getByGenre } from "./routes/albumes/getByGenre.js";
import { search } from "./routes/albumes/search.js";
import { create } from "./routes/albumes/create.js";
import { update } from "./routes/albumes/update.js";
import { remove } from "./routes/albumes/remove.js";
import { badRequest, notFound } from "./utils/responses.js";

export const app = express();
// Distingue rutas con y sin barra final (/albumes != /albumes/).
app.enable("strict routing");
// Permite leer el cuerpo JSON en POST y PUT.
app.use(express.json());

// Archivos estaticos: portadas de los albumes en /imagenes/*
app.use("/imagenes", express.static("public/imagenes"));

// Rutas de la API.
app.get("/", getInfo);
app.get("/albumes", getAll);
app.post("/albumes", create);
app.get("/album/:slug", getBySlug);
app.put("/album/:slug", update);
app.delete("/album/:slug", remove);
app.get("/genero/:genero", getByGenre);
app.get("/search/:text", search);

// 404 para cualquier ruta no definida (debe ir al final).
app.use((req, res) => notFound(res, "Ruta no encontrada"));

// Manejo de errores: cuerpo JSON malformado -> 400.
app.use((err, req, res, next) => {
  if (err?.type === "entity.parse.failed")
    return badRequest(res, "El cuerpo de la peticion no es un JSON valido");
  next(err);
});
