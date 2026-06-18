// GET /albumes              -> lista de slugs.
// GET /albumes?include=full -> todos los albumes con todos sus campos.
import * as albumes from "../../data/albumes.js";

export const getAll = (req, res) => {
  const isFull = req.query.include === "full";
  const data = isFull ? albumes.getAllFull() : albumes.getAllSlugs();
  res.json(data);
};
