require("dotenv").config();

const oracledb = require("oracledb");
const fs = require("fs");
const path = require("path");

function obtenerWallet() {

    if (
        process.env.TNSNAMES_BASE64 &&
        process.env.EWALLET_PEM_BASE64
    ) {

        const wallet =
            "/tmp/oracle-wallet";

        fs.mkdirSync(
            wallet,
            {
                recursive: true
            }
        );

        fs.writeFileSync(
            path.join(
                wallet,
                "tnsnames.ora"
            ),
            Buffer.from(
                process.env.TNSNAMES_BASE64,
                "base64"
            )
        );

        fs.writeFileSync(
            path.join(
                wallet,
                "ewallet.pem"
            ),
            Buffer.from(
                process.env.EWALLET_PEM_BASE64,
                "base64"
            )
        );

        return wallet;
    }

    return process.env.WALLET_LOCATION;
}


async function conectarOracle() {

    const wallet =
        obtenerWallet();

    const conexion =
        await oracledb.getConnection({
            user:
                process.env.DB_USER,

            password:
                process.env.DB_PASSWORD,

            connectString:
                process.env.DB_CONNECT_STRING,

            configDir:
                wallet,

            walletLocation:
                wallet,

            walletPassword:
                process.env.WALLET_PASSWORD,

            connectTimeout:
                10
        });

    return conexion;
}


module.exports = {
    conectarOracle
};