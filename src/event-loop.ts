console.log("Pertama");

setTimeout(() => {
  console.log("Keempat (setelah 1 detik)");
}, 1000);

console.log("Kedua");

setTimeout(() => {
  console.log("Ketiga (setelah 500ms)");
}, 500);