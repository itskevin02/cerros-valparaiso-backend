require("dotenv").config();

const oracledb = require("oracledb");

async function conectarOracle() {
    const wallet = process.env.WALLET_LOCATION;

    const conexion = await oracledb.getConnection({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        connectString: process.env.DB_CONNECT_STRING,
        configDir: wallet,
        walletLocation: wallet,
        walletPassword: process.env.WALLET_PASSWORD,
        connectTimeout: 10
    });

    return conexion;
}

module.exports = {
    conectarOracle
};