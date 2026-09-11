import dotenv from "dotenv";

dotenv.config();

// Helper: pastikan variable ada, kalau tidak langsung error saat start
function wajibAda(nama: string): string {
  const nilai = process.env[nama];
  if (!nilai) {
    throw new Error(`Environment variable ${nama} wajib diisi di file .env`);
  }
  return nilai;
}

function opsional(nama: string, bawaan: string): string {
  return process.env[nama] ?? bawaan;
}


export const config = {
  app: {
    name: opsional("APP_NAME", "API Jurnal Harian"),
    port: Number(opsional("PORT", "3000")),
    env: opsional("NODE_ENV", "development"),
  },
} as const;

export const isDev = config.app.env === "development";
export const isProd = config.app.env === "production";