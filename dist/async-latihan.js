"use strict";
const daftarPeserta = [
    { id: 1, nama: "Andi" },
    { id: 2, nama: "Budi" },
    { id: 3, nama: "Citra" },
    { id: 4, nama: "Dinda" },
];
// SOAL 1
function tunggu(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
async function hitungMundur(dari) {
    for (let i = dari; i >= 1; i--) {
        console.log(i);
        await tunggu(1000);
    }
    console.log("Selesai!");
}
// SOAL 2
function simulasiAmbilPeserta(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const peserta = daftarPeserta.find((p) => p.id === id);
            if (!peserta) {
                reject(new Error(`Peserta dengan ID ${id} tidak ditemukan`));
                return;
            }
            resolve(peserta);
        }, 500);
    });
}
// SOAL 3
async function ambilSemuaSequential(ids) {
    const hasil = [];
    for (const id of ids) {
        hasil.push(await simulasiAmbilPeserta(id));
    }
    return hasil;
}
async function ambilSemuaParallel(ids) {
    return Promise.all(ids.map((id) => simulasiAmbilPeserta(id)));
}
// SOAL 4
async function ambilDenganToleransi(ids) {
    const hasil = await Promise.allSettled(ids.map((id) => simulasiAmbilPeserta(id)));
    hasil.forEach((result, index) => {
        const id = ids[index];
        if (result.status === "fulfilled") {
            console.log(`ID ${id} berhasil:`, result.value);
        }
        else {
            console.log(`ID ${id} gagal:`, result.reason.message);
        }
    });
}
async function amanKan(promise) {
    try {
        const data = await promise;
        return { sukses: true, data };
    }
    catch (err) {
        return { sukses: false, error: err.message };
    }
}
async function main() {
    console.log("=== SOAL 1 ===");
    await hitungMundur(3);
    console.log("\n=== SOAL 2  ===");
    const cekPeserta1 = await amanKan(simulasiAmbilPeserta(1));
    const cekPeserta88 = await amanKan(simulasiAmbilPeserta(88));
    if (cekPeserta1.sukses) {
        console.log("Berhasil:", cekPeserta1.data);
    }
    else {
        console.log("Gagal:", cekPeserta1.error);
    }
    if (cekPeserta88.sukses) {
        console.log("Berhasil:", cekPeserta88.data);
    }
    else {
        console.log("Gagal:", cekPeserta88.error);
    }
    console.log("\n=== SOAL 3 ===");
    const ids = [1, 2, 3];
    console.time("Sequential");
    const hasilSequential = await ambilSemuaSequential(ids);
    console.timeEnd("Sequential");
    console.log("Hasil Sequential:", hasilSequential);
    // Sequential: ~1500ms (3 id, masing-masing 500ms, dijalankan satu-satu)
    console.time("Parallel");
    const hasilParallel = await ambilSemuaParallel(ids);
    console.timeEnd("Parallel");
    console.log("Hasil Parallel:", hasilParallel);
    // Parallel: ~500ms (3 id dijalankan bersamaan)
    // Selisih: Parallel ~1000ms lebih cepat dibanding Sequential
    console.log("\n=== SOAL 4 ===");
    await ambilDenganToleransi([1, 2, 88, 3]);
    console.log("\n=== SOAL 5  ===");
    const hasil1 = await amanKan(simulasiAmbilPeserta(1));
    const hasil2 = await amanKan(simulasiAmbilPeserta(88));
    if (hasil1.sukses) {
        console.log("Berhasil:", hasil1.data);
    }
    else {
        console.log("Gagal:", hasil1.error);
    }
    if (hasil2.sukses) {
        console.log("Berhasil:", hasil2.data);
    }
    else {
        console.log("Gagal:", hasil2.error);
    }
}
main();
//# sourceMappingURL=async-latihan.js.map