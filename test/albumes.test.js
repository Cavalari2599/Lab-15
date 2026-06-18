// Suite de pruebas de la API de DiscoStore con Vitest y supertest.
// Antes de todo se siembra una BD limpia con los 8 albumes iniciales.
import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { app } from "../app.js";
import { seedDatabase } from "../data/seed.js";

// Cuerpo valido reutilizado para crear y actualizar (slug generado -> "ok-computer").
const albumNuevo = {
  titulo: "OK Computer",
  artista: "Radiohead",
  genero: "Rock alternativo",
  anio: 1997,
  sello: "Parlophone",
  pistas: 12,
  resumen: "Disco clave del rock de los 90.",
  descripcion: "Tercer album de Radiohead, influyente por su sonido experimental."
};

beforeAll(() => {
  seedDatabase();
});

describe("GET /albumes", () => {
  it("lista los slugs: 200 y un arreglo que contiene un slug sembrado", async () => {
    const res = await request(app).get("/albumes");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toContain("thriller");
  });
});

describe("GET /album/:slug", () => {
  it("slug existente: 200 y el objeto del album", async () => {
    const res = await request(app).get("/album/thriller");
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ slug: "thriller", titulo: "Thriller" });
  });

  it("slug inexistente: 404 en JSON", async () => {
    const res = await request(app).get("/album/no-existe");
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });
});

describe("GET /search/:text", () => {
  it("texto con menos de 3 caracteres: 400 en JSON", async () => {
    const res = await request(app).get("/search/ab");
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
});

describe("POST /albumes", () => {
  it("cuerpo valido: 201, cabecera Location y objeto creado", async () => {
    const res = await request(app).post("/albumes").send(albumNuevo);
    expect(res.status).toBe(201);
    expect(res.headers.location).toBe("/album/ok-computer");
    expect(res.body).toMatchObject({ slug: "ok-computer", titulo: "OK Computer" });
  });

  it("cuerpo invalido: 400 en JSON", async () => {
    const res = await request(app)
      .post("/albumes")
      .send({ titulo: "", artista: "X", genero: "Pop", anio: 1982, sello: "Epic", pistas: 9 });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("slug duplicado: 409 en JSON", async () => {
    const res = await request(app)
      .post("/albumes")
      .send({
        titulo: "Thriller",
        artista: "Michael Jackson",
        genero: "Pop",
        anio: 1982,
        sello: "Epic",
        pistas: 9
      });
    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty("error");
  });
});

describe("PUT /album/:slug", () => {
  it("existente y valido: 200 y objeto actualizado", async () => {
    const res = await request(app)
      .put("/album/ok-computer")
      .send({ ...albumNuevo, sello: "EMI" });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ slug: "ok-computer", sello: "EMI" });
  });

  it("inexistente: 404 en JSON", async () => {
    const res = await request(app).put("/album/no-existe").send(albumNuevo);
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });
});

describe("DELETE /album/:slug", () => {
  it("existente: 204 sin cuerpo", async () => {
    const res = await request(app).delete("/album/ok-computer");
    expect(res.status).toBe(204);
    expect(res.text).toBe("");
  });

  it("inexistente: 404 en JSON", async () => {
    const res = await request(app).delete("/album/ok-computer");
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });
});
