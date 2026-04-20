"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rutasMonedas = void 0;
const express_1 = require("express");
const prisma_1 = require("../../utilidades/prisma");
const logger_1 = require("../../utilidades/logger");
const router = (0, express_1.Router)();
// Obtener todas las monedas soportadas
router.get('/', async (req, res) => {
    try {
        const monedas = await prisma_1.prisma.moneda.findMany();
        res.json(monedas);
    }
    catch (error) {
        logger_1.winstonLogger.error(`Error obteniendo monedas: ${error.message}`);
        res.status(500).json({ error: 'Error al obtener monedas' });
    }
});
// Obtener tasas de cambio actuales
router.get('/tasas', async (req, res) => {
    try {
        const tasas = await prisma_1.prisma.tasaCambio.findMany({
            include: { origen: true, destino: true }
        });
        res.json(tasas);
    }
    catch (error) {
        logger_1.winstonLogger.error(`Error obteniendo tasas: ${error.message}`);
        res.status(500).json({ error: 'Error al obtener tasas de cambio' });
    }
});
exports.rutasMonedas = router;
