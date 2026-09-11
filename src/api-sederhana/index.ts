import http from "http";
import { config } from "./config/env.config";
import { router } from "./server/router";

const server = http.createServer((req, res) => {
  router(req, res).catch((err) => {
    console.error("Unhandled error:", err);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Terjadi kesalahan internal server" }));
  });
});

server.listen(config.app.port, () => {
  console.log(`${config.app.name} berjalan di http://localhost:${config.app.port}`);
  console.log(`Mode: ${config.app.env}`);
});