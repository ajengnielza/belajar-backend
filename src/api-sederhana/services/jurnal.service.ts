import fs from "fs/promises";
import path from "path";
import { Jurnal, JurnalInput } from "../types/jurnal.types";

const DATA_PATH = path.join(__dirname, "../data/jurnal.json");

async function bacaSemua(): Promise<Jurnal[]> {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf-8");
    return JSON.parse(raw) as Jurnal[];
  } catch (err: any) {
    // Kalau file belum ada, buat file kosong dulu supaya server tetap jalan
    if (err.code === "ENOENT") {
      await fs.writeFile(DATA_PATH, "[]", "utf-8");
      return [];
    }
    throw err;
  }
}

async function simpanSemua(data: Jurnal[]): Promise<void> {
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export async function getSemuaJurnal(pesertaId?: number): Promise<Jurnal[]> {
  const semua = await bacaSemua();
  if (pesertaId !== undefined) {
    return semua.filter((j) => j.pesertaId === pesertaId);
  }
  return semua;
}

export async function getJurnalById(id: number): Promise<Jurnal | undefined> {
  const semua = await bacaSemua();
  return semua.find((j) => j.id === id);
}

export async function tambahJurnal(input: JurnalInput): Promise<Jurnal> {
  const semua = await bacaSemua();
  const idBaru = semua.length > 0 ? Math.max(...semua.map((j) => j.id)) + 1 : 1;
  const sekarang = new Date().toISOString();

  const jurnalBaru: Jurnal = {
    id: idBaru,
    pesertaId: input.pesertaId,
    kegiatan: input.kegiatan,
    createdAt: sekarang,
    updatedAt: sekarang,
  };

  semua.push(jurnalBaru);
  await simpanSemua(semua);
  return jurnalBaru;
}

export async function updateJurnal(
  id: number,
  input: Partial<JurnalInput>
): Promise<Jurnal | null> {
  const semua = await bacaSemua();
  const index = semua.findIndex((j) => j.id === id);
  if (index === -1) return null;

  semua[index] = {
    ...semua[index],
    ...input,
    updatedAt: new Date().toISOString(),
  };

  await simpanSemua(semua);
  return semua[index];
}

export async function hapusJurnal(id: number): Promise<boolean> {
  const semua = await bacaSemua();
  const index = semua.findIndex((j) => j.id === id);
  if (index === -1) return false;

  semua.splice(index, 1);
  await simpanSemua(semua);
  return true;
}