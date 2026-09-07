function infoSistem(): void {
  console.log("INFORMASI SISTEM :");
  console.log("Versi Node.js :", process.version);
  console.log("Platform OS   :", process.platform);
  console.log("Direktori kerja:", process.cwd());
  console.log("Uptime proses :", process.uptime(), "detik");
}

infoSistem();


const args: string[] = process.argv.slice(2);

console.log("Argumen diterima:", args.join(", "));