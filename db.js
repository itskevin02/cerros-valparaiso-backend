const oracledb = require("oracledb");
require("dotenv").config();

async function conectarOracle() {

    const conexion = await oracledb.getConnection({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        connectString: process.env.DB_CONNECT_STRING,
        configDir: process.env.DB_CONFIG_DIR,
        walletLocation: process.env.DB_CONFIG_DIR,
        walletPassword: process.env.DB_WALLET_PASSWORD,
        connectTimeout: 10
    });

    return conexion;
}

module.exports = {
    conectarOracle
};