"use strict";
function infoSistem() {
    console.log("INFORMASI SISTEM :");
    console.log("Versi Node.js :", process.version);
    console.log("Platform OS   :", process.platform);
    console.log("Direktori kerja:", process.cwd());
    console.log("Uptime proses :", process.uptime(), "detik");
}
infoSistem();
const args = process.argv.slice(2);
console.log("Argumen diterima:", args.join(", "));
//# sourceMappingURL=pengenalan.js.map