"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rutasAutomatizaciones = void 0;
const express_1 = require("express");
const prisma_1 = require("../../utilidades/prisma");
const logger_1 = require("../../utilidades/logger");
const router = (0, express_1.Router)();
// Listar automatizaciones
router.get('/', async (req, res) => {
    try {
        const automatizaciones = await prisma_1.prisma.empresa.findUnique({
            where: { id: req.empresa.id },
            select: { configuracion: true }
        });
        // Las automatizaciones se guardan en el JSON de configuración por ahora
        const config = automatizaciones?.configuracion || {};
        res.json(config.automatizaciones || []);
    }
    catch (error) {
        logger_1.winstonLogger.error(`Error obteniendo automatizaciones: ${error.message}`);
        res.status(500).json({ error: 'Error al obtener automatizaciones' });
    }
});
// Crear/Actualizar automatización
router.post('/', async (req, res) => {
    const { automatizaciones } = req.body;
    try {
        const empresa = await prisma_1.prisma.empresa.findUnique({
            where: { id: req.empresa.id }
        });
        const nuevaConfig = {
            ...(empresa?.configuracion || {}),
            automatizaciones
        };
        const actualizada = await prisma_1.prisma.empresa.update({
            where: { id: req.empresa.id },
            data: { configuracion: nuevaConfig }
        });
        res.json(actualizada.configuracion);
    }
    catch (error) {
        logger_1.winstonLogger.error(`Error guardando automatización: ${error.message}`);
        res.status(400).json({ error: 'No se pudo guardar la automatización' });
    }
});
exports.rutasAutomatizaciones = router;
