export interface Jurnal {
  id: number;
  pesertaId: number;
  kegiatan: string;
  createdAt: string;
  updatedAt: string;
}

export interface JurnalInput {
  pesertaId: number;
  kegiatan: string;
}