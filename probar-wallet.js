require("dotenv").config();

const fs = require("fs");
const path = require("path");

console.log("Ruta Wallet:");
console.log(process.env.WALLET_LOCATION);

const archivoTns = path.join(
    process.env.WALLET_LOCATION || "",
    "tnsnames.ora"
);

const archivoWallet = path.join(
    process.env.WALLET_LOCATION || "",
    "ewallet.pem"
);

console.log("");
console.log("tnsnames.ora:");
console.log(archivoTns);
console.log("Existe:", fs.existsSync(archivoTns));

console.log("");
console.log("ewallet.pem:");
console.log(archivoWallet);
console.log("Existe:", fs.existsSync(archivoWallet));

console.log("");
console.log("Connect String:");
console.log(process.env.DB_CONNECT_STRING);