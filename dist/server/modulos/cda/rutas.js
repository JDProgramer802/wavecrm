"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rutasCDA = void 0;
const express_1 = require("express");
const prisma_1 = require("../../utilidades/prisma");
const logger_1 = require("../../utilidades/logger");
const router = (0, express_1.Router)();
// Obtener vehículos de la empresa
router.get('/vehiculos', async (req, res) => {
    try {
        const vehiculos = await prisma_1.prisma.vehiculo.findMany({
            where: { empresa_id: req.empresa.id },
            include: { contacto: true, tipo: true }
        });
        res.json(vehiculos);
    }
    catch (error) {
        logger_1.winstonLogger.error(`Error obteniendo vehículos: ${error.message}`);
        res.status(500).json({ error: 'Error al obtener vehículos' });
    }
});
// Crear vehículo
router.post('/vehiculos', async (req, res) => {
    const { contacto_id, placa, tipo_vehiculo_id, marca, modelo, vencimiento_soat, vencimiento_tecnomecanica } = req.body;
    try {
        const vehiculo = await prisma_1.prisma.vehiculo.create({
            data: {
                empresa_id: req.empresa.id,
                contacto_id,
                placa,
                tipo_vehiculo_id,
                marca,
                modelo,
                vencimiento_soat: vencimiento_soat ? new Date(vencimiento_soat) : null,
                vencimiento_tecnomecanica: vencimiento_tecnomecanica ? new Date(vencimiento_tecnomecanica) : null
            }
        });
        res.status(201).json(vehiculo);
    }
    catch (error) {
        logger_1.winstonLogger.error(`Error creando vehículo: ${error.message}`);
        res.status(400).json({ error: 'No se pudo registrar el vehículo' });
    }
});
// Citas CDA
router.get('/citas', async (req, res) => {
    try {
        const citas = await prisma_1.prisma.citaCDA.findMany({
            where: { empresa_id: req.empresa.id },
            include: { vehiculo: { include: { contacto: true } } },
            orderBy: { fecha_hora: 'asc' }
        });
        res.json(citas);
    }
    catch (error) {
        logger_1.winstonLogger.error(`Error obteniendo citas CDA: ${error.message}`);
        res.status(500).json({ error: 'Error al obtener citas' });
    }
});
router.post('/citas', async (req, res) => {
    const { vehiculo_id, fecha_hora, notas } = req.body;
    try {
        const cita = await prisma_1.prisma.citaCDA.create({
            data: {
                empresa_id: req.empresa.id,
                vehiculo_id,
                fecha_hora: new Date(fecha_hora),
                estado: 'programada',
                notas
            }
        });
        res.status(201).json(cita);
    }
    catch (error) {
        logger_1.winstonLogger.error(`Error creando cita CDA: ${error.message}`);
        res.status(400).json({ error: 'No se pudo programar la cita' });
    }
});
exports.rutasCDA = router;
