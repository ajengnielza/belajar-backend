import path from "path";
import fs from "fs/promises";
import os from "os";    

const filePath = path.join(__dirname, "data", "tasks.json");

console.log(filePath);


function analisisPath(filePath: string): void {
    console.log("Nama file:", path.basename(filePath));
    console.log("Ekstensi:", path.extname(filePath));
    console.log("Folder induk:", path.dirname(filePath));
    console.log("Path absolut:", path.resolve(filePath));
}
analisisPath("./data/tasks.json");

async function simpanLog(pesan: string): Promise<void> {
    const logsDir = path.join(__dirname, "..", "logs");
    const logFile = path.join(logsDir, "app.log");

    await fs.mkdir(logsDir, { recursive: true });

    const timestamp = new Date()
    .toISOString()
    .replace("T", " ")
    .slice(0, 19);

    await fs.appendFile(
    logFile,
    `[${timestamp}] ${pesan}\n`,
    "utf-8"
    );
}

async function daftarFile(folder: string): Promise<void> {
    const isiFolder = await fs.readdir(folder);

    for (const namaFile of isiFolder) {
        const filePath = path.join(folder, namaFile);
        const stat = await fs.stat(filePath);

        if (!stat.isDirectory()) {
            const ukuranKB = stat.size / 1024;

            console.log(
                `${namaFile.padEnd(20)} ${ukuranKB.toFixed(2)} KB`
            );
        }
    }
}

interface Task {
    id: number;
    judul: string;
    selesai: boolean;
}

async function bacaJSON<T>(filePath: string): Promise<T> {
    const isi = await fs.readFile(filePath, "utf-8");

    return JSON.parse(isi) as T;
}

async function tulisJSON<T>(
    filePath: string,
    data: T
): Promise<void> {
    await fs.writeFile(
        filePath,
        JSON.stringify(data, null, 2),
        "utf-8"
    );
}

function laporanSistem(): string {
    const totalRAM = os.totalmem();
    const freeRAM = os.freemem();

    const totalRAMGB = totalRAM / 1024 ** 3;
    const freeRAMGB = freeRAM / 1024 ** 3;

    return `
LAPORAN SISTEM 
OS              : ${os.platform()}
CPU             : ${os.cpus().length} core
Total RAM       : ${totalRAMGB.toFixed(2)} GB
RAM Tersedia    : ${freeRAMGB.toFixed(2)} GB
Home Directory  : ${os.homedir()}
Hostname        : ${os.hostname()}
Uptime          : ${(os.uptime() / 3600).toFixed(2)} jam
`;
}

async function main(): Promise<void> {
    const dataDir = path.join(__dirname, "..", "data");

    await fs.mkdir(dataDir, { recursive: true });

    const taskFile = path.join(dataDir, "tasks.json");

    const tasks: Task[] = [
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

    await tulisJSON<Task[]>(taskFile, tasks);

    const hasil = await bacaJSON<Task[]>(taskFile);

    console.log("Data task:");
    console.log(hasil);
    console.log(laporanSistem());
}

main();