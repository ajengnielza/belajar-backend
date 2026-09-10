import http, { IncomingMessage, ServerResponse } from "http";


interface Peserta {
  id: number;
  nama: string;
  sekolah: string;
}

let peserta: Peserta[] = [
  { id: 1, nama: "Budi", sekolah: "SMK 5 Malang" },
  { id: 2, nama: "Ajeng", sekolah: "SMK 1 Malang" },
  { id: 3, nama: "Citra", sekolah: "SMK 5 Malang" },
];

let nextId = 4;

// Waktu server mulai dijalankan, dipakai untuk hitung uptime di /health
const startTime = Date.now();


// HELPER — supaya kita tidak menulis res.writeHead + res.end berulang-ulang
function sendJSON(res: ServerResponse, statusCode: number, data: unknown) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}


// SERVER UTAMA
const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
  const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
  const path = url.pathname;
  const method = req.method;

 
  // SOAL 1: GET 
  if (method === "GET" && path === "/") {
    return sendJSON(res, 200, { pesan: "API Peserta Magang Batch 4" });
  }

  
  // GET /health
  if (method === "GET" && path === "/health") {
    const uptimeDetik = Math.floor((Date.now() - startTime) / 1000);
    return sendJSON(res, 200, { status: "ok", uptime: uptimeDetik });
  }

 
  //  GET /peserta  (+ filter query ?sekolah=)
  if (method === "GET" && path === "/peserta") {
    const sekolah = url.searchParams.get("sekolah");

    let hasil = peserta;
    if (sekolah) {
      hasil = peserta.filter(
        (p) => p.sekolah.toLowerCase() === sekolah.toLowerCase()
      );
    }
    return sendJSON(res, 200, hasil);
  }


  // SOAL 2: GET /peserta/:id
  if (method === "GET" && path.startsWith("/peserta/")) {
    const id = Number(path.split("/")[2]);
    const satu = peserta.find((p) => p.id === id);

    if (!satu) {
      return sendJSON(res, 404, { error: `Peserta dengan id ${id} tidak ditemukan` });
    }
    return sendJSON(res, 200, satu);
  }

  // SOAL 4: POST /peserta
  if (method === "POST" && path === "/peserta") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      let data: { nama?: string; sekolah?: string };

      try {
        data = JSON.parse(body);
      } catch {
        return sendJSON(res, 400, { error: "JSON tidak valid" });
      }

      // Validasi: nama tidak boleh kosong
      if (!data.nama || data.nama.trim() === "") {
        return sendJSON(res, 400, { error: "Nama tidak boleh kosong" });
      }

      const pesertaBaru: Peserta = {
        id: nextId++,
        nama: data.nama.trim(),
        sekolah: data.sekolah?.trim() ?? "",
      };

      peserta.push(pesertaBaru);
      return sendJSON(res, 201, { sukses: true, data: pesertaBaru });
    });

    return; // penting: keluar dari handler, respons dikirim di dalam req.on("end")
  }

  // SOAL 5: DELETE /peserta/:id
  
  if (method === "DELETE" && path.startsWith("/peserta/")) {
    const id = Number(path.split("/")[2]);
    const index = peserta.findIndex((p) => p.id === id);

    if (index === -1) {
      return sendJSON(res, 404, { error: `Peserta dengan id ${id} tidak ditemukan` });
    }

    peserta.splice(index, 1);
    res.writeHead(204); 
    return res.end();
  }

  return sendJSON(res, 404, { error: `Route tidak ditemukan: ${method} ${path}` });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});