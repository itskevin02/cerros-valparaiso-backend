require("dotenv").config();

const express = require("express");
const cors = require("cors");
const oracledb = require("oracledb");

const { conectarOracle } = require("./db");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


/* =========================================
   INICIO
========================================= */

app.get("/", function (req, res) {
    res.json({
        mensaje: "Backend Cerros de Valparaíso funcionando"
    });
});


/* =========================================
   SALUD
========================================= */

app.get("/api/salud", function (req, res) {
    res.json({
        mensaje: "API Cerros de Valparaíso funcionando"
    });
});


/* =========================================
   PRUEBA ORACLE
========================================= */

app.get("/api/oracle", async function (req, res) {
    let conexion;

    try {
        conexion = await conectarOracle();

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

        res.json(resultado.rows[0]);

    } catch (error) {

        res.status(500).json({
            error: "No se pudo conectar con Oracle",
            detalle: error.message
        });

    } finally {

        if (conexion) {
            await conexion.close();
        }
    }
});


/* =========================================
   OPERADORES
========================================= */

app.get("/api/operadores", async function (req, res) {
    let conexion;

    try {
        conexion = await conectarOracle();

        const resultado = await conexion.execute(
            `
            SELECT
                id_operador AS "id_operador",
                nombre_fantasia AS "nombre_fantasia",
                cerro AS "cerro",
                pct_comision AS "pct_comision"
            FROM operador_turistico
            ORDER BY id_operador
            `,
            [],
            {
                outFormat: oracledb.OUT_FORMAT_OBJECT
            }
        );

        res.json(resultado.rows);

    } catch (error) {

        res.status(500).json({
            error: "No se pudieron obtener los operadores",
            detalle: error.message
        });

    } finally {

        if (conexion) {
            await conexion.close();
        }
    }
});


/* =========================================
   SERVICIOS
========================================= */

app.get("/api/servicios", async function (req, res) {
    let conexion;

    try {
        conexion = await conectarOracle();

        const resultado = await conexion.execute(
            `
            SELECT
                id_servicio AS "id_servicio",
                id_operador AS "id_operador",
                descripcion AS "descripcion",
                tarifa_base AS "tarifa_base",
                capacidad_max AS "capacidad_max"
            FROM servicio_turistico
            ORDER BY id_servicio
            `,
            [],
            {
                outFormat: oracledb.OUT_FORMAT_OBJECT
            }
        );

        res.json(resultado.rows);

    } catch (error) {

        res.status(500).json({
            error: "No se pudieron obtener los servicios",
            detalle: error.message
        });

    } finally {

        if (conexion) {
            await conexion.close();
        }
    }
});


/* =========================================
   RESERVAS
========================================= */

app.get("/api/reservas", async function (req, res) {
    let conexion;

    try {
        conexion = await conectarOracle();

        const resultado = await conexion.execute(
            `
            SELECT
                id_reserva AS "id_reserva",
                rut_cliente AS "rut_cliente",
                fecha_reserva AS "fecha_reserva",
                estado AS "estado"
            FROM reserva
            ORDER BY id_reserva
            `,
            [],
            {
                outFormat: oracledb.OUT_FORMAT_OBJECT
            }
        );

        res.json(resultado.rows);

    } catch (error) {

        res.status(500).json({
            error: "No se pudieron obtener las reservas",
            detalle: error.message
        });

    } finally {

        if (conexion) {
            await conexion.close();
        }
    }
});


/* =========================================
   DETALLES
========================================= */

app.get("/api/detalles", async function (req, res) {
    let conexion;

    try {
        conexion = await conectarOracle();

        const resultado = await conexion.execute(
            `
            SELECT
                d.id_detalle AS "id_detalle",
                d.id_reserva AS "id_reserva",
                d.id_servicio AS "id_servicio",
                s.descripcion AS "descripcion_servicio",
                d.cant_turistas AS "cant_turistas",
                d.subtotal AS "subtotal",
                d.fecha_servicio AS "fecha_servicio"
            FROM detalle_reserva d

            JOIN servicio_turistico s
                ON d.id_servicio = s.id_servicio

            ORDER BY d.id_detalle
            `,
            [],
            {
                outFormat: oracledb.OUT_FORMAT_OBJECT
            }
        );

        res.json(resultado.rows);

    } catch (error) {

        res.status(500).json({
            error: "No se pudieron obtener los detalles",
            detalle: error.message
        });

    } finally {

        if (conexion) {
            await conexion.close();
        }
    }
});


/* =========================================
   RESUMEN OPERADORES
========================================= */

app.get(
    "/api/resumen-operadores",
    async function (req, res) {

        let conexion;

        try {
            conexion = await conectarOracle();

            const resultado = await conexion.execute(
                `
                SELECT
                    id_operador AS "id_operador",
                    nombre_fantasia AS "nombre_fantasia",
                    cerro AS "cerro",
                    pct_comision AS "pct_comision",
                    total_servicios AS "total_servicios",
                    total_ventas AS "total_ventas",
                    monto_comision AS "monto_comision",
                    monto_a_pagar AS "monto_a_pagar"
                FROM vw_resumen_operadores
                ORDER BY id_operador
                `,
                [],
                {
                    outFormat: oracledb.OUT_FORMAT_OBJECT
                }
            );

            res.json(resultado.rows);

        } catch (error) {

            res.status(500).json({
                error:
                    "No se pudo obtener el resumen de operadores",
                detalle: error.message
            });

        } finally {

            if (conexion) {
                await conexion.close();
            }
        }
    }
);


/* =========================================
   TOTAL VENTAS
========================================= */

app.get("/api/total-ventas", async function (req, res) {
    let conexion;

    try {
        conexion = await conectarOracle();

        const resultado = await conexion.execute(
            `
            SELECT
                obtener_total_ventas() AS "total_ventas"
            FROM dual
            `,
            [],
            {
                outFormat: oracledb.OUT_FORMAT_OBJECT
            }
        );

        res.json(resultado.rows[0]);

    } catch (error) {

        res.status(500).json({
            error: "No se pudo obtener el total de ventas",
            detalle: error.message
        });

    } finally {

        if (conexion) {
            await conexion.close();
        }
    }
});


/* =========================================
   LIQUIDACIONES
========================================= */

app.get("/api/liquidaciones", async function (req, res) {
    let conexion;

    try {
        conexion = await conectarOracle();

        const resultado = await conexion.execute(
            `
            SELECT
                id_liquidacion AS "id_liquidacion",
                id_operador AS "id_operador",
                monto_bruto AS "monto_bruto",
                monto_comision AS "monto_comision",
                monto_a_pagar AS "monto_a_pagar",
                fecha_calculo AS "fecha_calculo"
            FROM liquidacion_operador
            ORDER BY id_liquidacion
            `,
            [],
            {
                outFormat: oracledb.OUT_FORMAT_OBJECT
            }
        );

        res.json(resultado.rows);

    } catch (error) {

        res.status(500).json({
            error: "No se pudieron obtener las liquidaciones",
            detalle: error.message
        });

    } finally {

        if (conexion) {
            await conexion.close();
        }
    }
});


/* =========================================
   AUDITORÍA
========================================= */

app.get("/api/auditoria", async function (req, res) {
    let conexion;

    try {
        conexion = await conectarOracle();

        const resultado = await conexion.execute(
            `
            SELECT
                id_auditoria AS "id_auditoria",
                fecha_evento AS "fecha_evento",
                usuario_bd AS "usuario_bd",
                operacion AS "operacion"
            FROM auditoria_detalle_reserva
            ORDER BY id_auditoria
            `,
            [],
            {
                outFormat: oracledb.OUT_FORMAT_OBJECT
            }
        );

        res.json(resultado.rows);

    } catch (error) {

        res.status(500).json({
            error: "No se pudo obtener la auditoría",
            detalle: error.message
        });

    } finally {

        if (conexion) {
            await conexion.close();
        }
    }
});


/* =========================================
   REGISTRAR DETALLE
========================================= */

app.post("/api/detalles", async function (req, res) {
    let conexion;

    const {
        id_detalle,
        id_reserva,
        id_servicio,
        cant_turistas,
        subtotal,
        fecha_servicio
    } = req.body;

    if (
        !id_detalle ||
        !id_reserva ||
        !id_servicio ||
        !cant_turistas ||
        subtotal === undefined ||
        !fecha_servicio
    ) {
        return res.status(400).json({
            error: "Debe completar todos los campos"
        });
    }

    try {
        conexion = await conectarOracle();

        await conexion.execute(
            `
            INSERT INTO detalle_reserva (
                id_detalle,
                id_reserva,
                id_servicio,
                cant_turistas,
                subtotal,
                fecha_servicio
            )
            VALUES (
                :id_detalle,
                :id_reserva,
                :id_servicio,
                :cant_turistas,
                :subtotal,
                TO_DATE(
                    :fecha_servicio,
                    'YYYY-MM-DD'
                )
            )
            `,
            {
                id_detalle: Number(id_detalle),
                id_reserva: Number(id_reserva),
                id_servicio: Number(id_servicio),
                cant_turistas: Number(cant_turistas),
                subtotal: Number(subtotal),
                fecha_servicio: fecha_servicio
            }
        );

        await conexion.commit();

        res.status(201).json({
            mensaje:
                "Detalle de reserva registrado correctamente"
        });

    } catch (error) {

        if (conexion) {
            await conexion.rollback();
        }

        res.status(500).json({
            error: error.message
        });

    } finally {

        if (conexion) {
            await conexion.close();
        }
    }
});


/* =========================================
   ACTUALIZAR DETALLE
========================================= */

app.put(
    "/api/detalles/:id",
    async function (req, res) {

        let conexion;

        const idDetalle =
            Number(req.params.id);

        const {
            id_reserva,
            id_servicio,
            cant_turistas,
            subtotal,
            fecha_servicio
        } = req.body;

        if (
            !idDetalle ||
            !id_reserva ||
            !id_servicio ||
            !cant_turistas ||
            subtotal === undefined ||
            !fecha_servicio
        ) {
            return res.status(400).json({
                error:
                    "Debe completar todos los campos"
            });
        }

        try {
            conexion =
                await conectarOracle();

            const resultado =
                await conexion.execute(
                    `
                    UPDATE detalle_reserva

                    SET
                        id_reserva = :id_reserva,
                        id_servicio = :id_servicio,
                        cant_turistas = :cant_turistas,
                        subtotal = :subtotal,
                        fecha_servicio =
                            TO_DATE(
                                :fecha_servicio,
                                'YYYY-MM-DD'
                            )

                    WHERE id_detalle =
                        :id_detalle
                    `,
                    {
                        id_reserva:
                            Number(id_reserva),

                        id_servicio:
                            Number(id_servicio),

                        cant_turistas:
                            Number(cant_turistas),

                        subtotal:
                            Number(subtotal),

                        fecha_servicio:
                            fecha_servicio,

                        id_detalle:
                            idDetalle
                    }
                );

            if (
                resultado.rowsAffected === 0
            ) {
                await conexion.rollback();

                return res.status(404).json({
                    error:
                        "El detalle indicado no existe"
                });
            }

            await conexion.commit();

            res.json({
                mensaje:
                    "Detalle de reserva actualizado correctamente"
            });

        } catch (error) {

            if (conexion) {
                await conexion.rollback();
            }

            res.status(500).json({
                error: error.message
            });

        } finally {

            if (conexion) {
                await conexion.close();
            }
        }
    }
);


/* =========================================
   ELIMINAR DETALLE
========================================= */

app.delete(
    "/api/detalles/:id",
    async function (req, res) {

        let conexion;

        const idDetalle =
            Number(req.params.id);

        if (!idDetalle) {
            return res.status(400).json({
                error:
                    "ID de detalle no válido"
            });
        }

        try {
            conexion =
                await conectarOracle();

            const resultado =
                await conexion.execute(
                    `
                    DELETE FROM detalle_reserva
                    WHERE id_detalle = :id_detalle
                    `,
                    {
                        id_detalle:
                            idDetalle
                    }
                );

            if (
                resultado.rowsAffected === 0
            ) {
                await conexion.rollback();

                return res.status(404).json({
                    error:
                        "El detalle indicado no existe"
                });
            }

            await conexion.commit();

            res.json({
                mensaje:
                    "Detalle de reserva eliminado correctamente"
            });

        } catch (error) {

            if (conexion) {
                await conexion.rollback();
            }

            res.status(500).json({
                error:
                    "No se pudo eliminar el detalle",

                detalle:
                    error.message
            });

        } finally {

            if (conexion) {
                await conexion.close();
            }
        }
    }
);


/* =========================================
   GENERAR TODAS LAS LIQUIDACIONES
========================================= */

app.post(
    "/api/liquidaciones/generar-todas",
    async function (req, res) {

        let conexion;

        try {
            conexion =
                await conectarOracle();

            await conexion.execute(
                `
                BEGIN
                    generar_liquidaciones_todos;
                END;
                `
            );

            await conexion.commit();

            res.json({
                mensaje:
                    "Liquidaciones generadas correctamente"
            });

        } catch (error) {

            if (conexion) {
                await conexion.rollback();
            }

            res.status(500).json({
                error:
                    "No se pudieron generar las liquidaciones",

                detalle:
                    error.message
            });

        } finally {

            if (conexion) {
                await conexion.close();
            }
        }
    }
);


/* =========================================
   GENERAR UNA LIQUIDACIÓN
========================================= */

app.post(
    "/api/liquidaciones/:idOperador",
    async function (req, res) {

        let conexion;

        const idOperador =
            Number(
                req.params.idOperador
            );

        if (!idOperador) {
            return res.status(400).json({
                error:
                    "Operador no válido"
            });
        }

        try {
            conexion =
                await conectarOracle();

            await conexion.execute(
                `
                BEGIN
                    generar_liquidacion(
                        :id_operador
                    );
                END;
                `,
                {
                    id_operador:
                        idOperador
                }
            );

            await conexion.commit();

            res.json({
                mensaje:
                    `Liquidación del operador ${idOperador} generada correctamente`
            });

        } catch (error) {

            if (conexion) {
                await conexion.rollback();
            }

            res.status(500).json({
                error:
                    "No se pudo generar la liquidación",

                detalle:
                    error.message
            });

        } finally {

            if (conexion) {
                await conexion.close();
            }
        }
    }
);


/* =========================================
   SERVIDOR
========================================= */

app.listen(
    PORT,
    "0.0.0.0",
    function () {
        console.log(
            `Servidor ejecutándose en el puerto ${PORT}`
        );
    }
);