import { IncomingMessage, ServerResponse } from "http";
import * as jurnalService from "../services/jurnal.service";
import { JurnalInput } from "../types/jurnal.types";

const startTime = Date.now();

function kirimJSON(res: ServerResponse, statusCode: number, data: unknown) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

function bacaBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Body bukan JSON yang valid"));
      }
    });
    req.on("error", reject);
  });
}

function validasiInput(input: Partial<JurnalInput>): string | null {
  if (input.kegiatan !== undefined && input.kegiatan.trim().length < 10) {
    return "kegiatan minimal 10 karakter";
  }
  return null;
}

export async function handleHealth(_req: IncomingMessage, res: ServerResponse) {
  const uptimeDetik = Math.floor((Date.now() - startTime) / 1000);
  kirimJSON(res, 200, { status: "ok", uptime: `${uptimeDetik}s` });
}

export async function handleGetSemua(
  _req: IncomingMessage,
  res: ServerResponse,
  query: URLSearchParams
) {
  try {
    const pesertaParam = query.get("peserta");
    const pesertaId = pesertaParam ? Number(pesertaParam) : undefined;
    const data = await jurnalService.getSemuaJurnal(pesertaId);
    kirimJSON(res, 200, data);
  } catch {
    kirimJSON(res, 500, { error: "Gagal mengambil data jurnal" });
  }
}

export async function handleGetById(_req: IncomingMessage, res: ServerResponse, id: number) {
  try {
    const data = await jurnalService.getJurnalById(id);
    if (!data) return kirimJSON(res, 404, { error: "Jurnal tidak ditemukan" });
    kirimJSON(res, 200, data);
  } catch {
    kirimJSON(res, 500, { error: "Gagal mengambil data jurnal" });
  }
}

export async function handleTambah(req: IncomingMessage, res: ServerResponse) {
  try {
    const body = await bacaBody(req);

    if (!body.pesertaId || !body.kegiatan) {
      return kirimJSON(res, 400, { error: "pesertaId dan kegiatan wajib diisi" });
    }

    const errorValidasi = validasiInput(body);
    if (errorValidasi) return kirimJSON(res, 400, { error: errorValidasi });

    const jurnalBaru = await jurnalService.tambahJurnal({
      pesertaId: Number(body.pesertaId),
      kegiatan: String(body.kegiatan),
    });

    kirimJSON(res, 201, jurnalBaru);
  } catch (err: any) {
    kirimJSON(res, 400, { error: err.message || "Gagal menambah jurnal" });
  }
}

export async function handleUpdate(req: IncomingMessage, res: ServerResponse, id: number) {
  try {
    const body = await bacaBody(req);

    const errorValidasi = validasiInput(body);
    if (errorValidasi) return kirimJSON(res, 400, { error: errorValidasi });

    const hasil = await jurnalService.updateJurnal(id, body);
    if (!hasil) return kirimJSON(res, 404, { error: "Jurnal tidak ditemukan" });

    kirimJSON(res, 200, hasil);
  } catch (err: any) {
    kirimJSON(res, 400, { error: err.message || "Gagal update jurnal" });
  }
}

export async function handleHapus(_req: IncomingMessage, res: ServerResponse, id: number) {
  try {
    const berhasil = await jurnalService.hapusJurnal(id);
    if (!berhasil) return kirimJSON(res, 404, { error: "Jurnal tidak ditemukan" });
    res.writeHead(204);
    res.end();
  } catch {
    kirimJSON(res, 500, { error: "Gagal menghapus jurnal" });
  }
}