"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const os_1 = __importDefault(require("os"));
const filePath = path_1.default.join(__dirname, "data", "tasks.json");
console.log(filePath);
function analisisPath(filePath) {
    console.log("Nama file:", path_1.default.basename(filePath));
    console.log("Ekstensi:", path_1.default.extname(filePath));
    console.log("Folder induk:", path_1.default.dirname(filePath));
    console.log("Path absolut:", path_1.default.resolve(filePath));
}
analisisPath("./data/tasks.json");
async function simpanLog(pesan) {
    const logsDir = path_1.default.join(__dirname, "..", "logs");
    const logFile = path_1.default.join(logsDir, "app.log");
    await promises_1.default.mkdir(logsDir, { recursive: true });
    const timestamp = new Date()
        .toISOString()
        .replace("T", " ")
        .slice(0, 19);
    await promises_1.default.appendFile(logFile, `[${timestamp}] ${pesan}\n`, "utf-8");
}
async function daftarFile(folder) {
    const isiFolder = await promises_1.default.readdir(folder);
    for (const namaFile of isiFolder) {
        const filePath = path_1.default.join(folder, namaFile);
        const stat = await promises_1.default.stat(filePath);
        if (!stat.isDirectory()) {
            const ukuranKB = stat.size / 1024;
            console.log(`${namaFile.padEnd(20)} ${ukuranKB.toFixed(2)} KB`);
        }
    }
}
async function bacaJSON(filePath) {
    const isi = await promises_1.default.readFile(filePath, "utf-8");
    return JSON.parse(isi);
}
async function tulisJSON(filePath, data) {
    await promises_1.default.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}
function laporanSistem() {
    const totalRAM = os_1.default.totalmem();
    const freeRAM = os_1.default.freemem();
    const totalRAMGB = totalRAM / 1024 ** 3;
    const freeRAMGB = freeRAM / 1024 ** 3;
    return `
LAPORAN SISTEM 
OS              : ${os_1.default.platform()}
CPU             : ${os_1.default.cpus().length} core
Total RAM       : ${totalRAMGB.toFixed(2)} GB
RAM Tersedia    : ${freeRAMGB.toFixed(2)} GB
Home Directory  : ${os_1.default.homedir()}
Hostname        : ${os_1.default.hostname()}
Uptime          : ${(os_1.default.uptime() / 3600).toFixed(2)} jam
`;
}
async function main() {
    const dataDir = path_1.default.join(__dirname, "..", "data");
    await promises_1.default.mkdir(dataDir, { recursive: true });
    const taskFile = path_1.default.join(dataDir, "tasks.json");
    const tasks = [
        {
            id: 1,
            judul: "Belajar Node.js",
            selesai: false
        },
        {
            id: 2,
            judul: "Belajar fs",
            selesai: true
        },
        {
            id: 3,
            judul: "Mengerjakan latihan",
            selesai: false
        }
    ];
    await tulisJSON(taskFile, tasks);
    const hasil = await bacaJSON(taskFile);
    console.log("Data task:");
    console.log(hasil);
    console.log(laporanSistem());
}
main();
//# sourceMappingURL=file-manager.js.map