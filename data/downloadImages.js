// Descarga las portadas de cada album desde Wikipedia, usando fetch nativo
// y node:fs/promises. Es solo para fines de la tarea.
// Ejecutar con:  npm run images:download   (o)   node data/downloadImages.js
import { writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { cwd } from "node:process";
import data from "./data.json" with { type: "json" };

const OUT_DIR = `${cwd()}/public/imagenes`;
const API_URL = "https://en.wikipedia.org/api/rest_v1/page/summary";
const USER_AGENT = "TareaMultimedios/1.0 (estudiante; tarea de curso)";
// Pausa entre descargas para respetar el limite de peticiones de Wikipedia.
const DELAY_MS = 2000;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Articulo de Wikipedia (en ingles) de cada album, por slug.
const ARTICLES = {
  thriller: "Thriller_(Michael_Jackson_album)",
  "the-dark-side-of-the-moon": "The_Dark_Side_of_the_Moon",
  "back-in-black": "Back_in_Black",
  rumours: "Rumours_(Fleetwood_Mac_album)",
  nevermind: "Nevermind",
  "abbey-road": "Abbey_Road",
  "kind-of-blue": "Kind_of_Blue",
  "the-chronic": "The_Chronic"
};

// Pide al API de Wikipedia la miniatura del articulo y devuelve su URL.
const getThumbnailUrl = async (article) => {
  const response = await fetchWithRetry(`${API_URL}/${article}`);
  const summary = await response.json();
  const url = summary.thumbnail?.source;
  if (!url) throw new Error(`Sin miniatura para ${article}`);
  return url;
};

// Pide una URL reintentando con espera si Wikipedia limita las peticiones (429).
const fetchWithRetry = async (url, retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const response = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
    if (response.ok) return response;
    if (response.status === 429 && attempt < retries) {
      console.log(`  Limite de peticiones (429); esperando para reintentar...`);
      await wait(DELAY_MS * 5);
      continue;
    }
    throw new Error(`Peticion fallo (${response.status}) para ${url}`);
  }
};

// Descarga una portada y la guarda en public/imagenes.
const downloadImage = async (album) => {
  const destination = `${OUT_DIR}/${album.imagen}`;
  if (existsSync(destination)) {
    console.log(`Ya existe, se omite: ${album.imagen}`);
    return;
  }

  const article = ARTICLES[album.slug];
  const url = await getThumbnailUrl(article);

  const response = await fetchWithRetry(url);
  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(destination, buffer);
  console.log(`Portada descargada: ${album.imagen} (${buffer.length} bytes)`);
  await wait(DELAY_MS);
};

await mkdir(OUT_DIR, { recursive: true });
let ok = 0;
for (const album of data) {
  try {
    await downloadImage(album);
    ok++;
  } catch (error) {
    // Un articulo que falle no detiene la descarga de los demas.
    console.error(`No se pudo bajar ${album.imagen}: ${error.message}`);
  }
}
console.log(`\n${ok} de ${data.length} portadas disponibles en ${OUT_DIR}`);
