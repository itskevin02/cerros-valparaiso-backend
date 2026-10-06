require("dotenv").config();

const oracledb = require("oracledb");

const wallet = process.env.WALLET_LOCATION;

async function probarConexion() {
    let conexion;

    try {
        console.log("Versión oracledb:", oracledb.versionString);
        console.log("Modo Thin:", oracledb.thin);
        console.log("Wallet:", wallet);
        console.log("Servicio:", process.env.DB_CONNECT_STRING);

        console.log("\nBuscando servicios en tnsnames.ora...");

        const servicios =
            await oracledb.getNetworkServiceNames(wallet);

        console.log("Servicios encontrados:");
        console.log(servicios);

        console.log("\nIntentando conexión con Oracle...");

        conexion = await oracledb.getConnection({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectString: process.env.DB_CONNECT_STRING,
            configDir: wallet,
            walletLocation: wallet,
            walletPassword: process.env.WALLET_PASSWORD
        });

        console.log("\nLISTO AHORA SI CONECTADO CORRECTAMENTE");

        const resultado = await conexion.execute(
            `
            SELECT
                'Conexion Oracle correcta' AS "mensaje"
            FROM dual
            `,
            [],
            {
                outFormat: oracledb.OUT_FORMAT_OBJECT
            }
        );

        console.log(resultado.rows);

    } catch (error) {
        console.log("\nERROR:");
        console.log(error.message);

    } finally {
        if (conexion) {
            await conexion.close();
            console.log("Conexión cerrada");
        }
    }
}

probarConexion();