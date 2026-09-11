import { IncomingMessage, ServerResponse } from "http";
import * as handlers from "./handlers";

export async function router(req: IncomingMessage, res: ServerResponse) {
  const url = new URL(req.url || "/", `http://${req.headers.host}`);
  const path = url.pathname;
  const method = req.method;

  // GET /health
  if (method === "GET" && path === "/health") {
    return handlers.handleHealth(req, res);
  }

  // GET /jurnal  atau  GET /jurnal?peserta=1
  if (method === "GET" && path === "/jurnal") {
    return handlers.handleGetSemua(req, res, url.searchParams);
  }

  const matchId = path.match(/^\/jurnal\/(\d+)$/);

  // GET /jurnal/:id
  if (method === "GET" && matchId) {
    return handlers.handleGetById(req, res, Number(matchId[1]));
  }

  // POST /jurnal
  if (method === "POST" && path === "/jurnal") {
    return handlers.handleTambah(req, res);
  }

  // PUT /jurnal/:id
  if (method === "PUT" && matchId) {
    return handlers.handleUpdate(req, res, Number(matchId[1]));
  }

  // DELETE /jurnal/:id
  if (method === "DELETE" && matchId) {
    return handlers.handleHapus(req, res, Number(matchId[1]));
  }

  // Route tidak ditemukan
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Route tidak ditemukan" }));
}