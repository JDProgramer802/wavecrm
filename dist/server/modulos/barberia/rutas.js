"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rutasBarberia = void 0;
const express_1 = require("express");
const prisma_1 = require("../../utilidades/prisma");
const logger_1 = require("../../utilidades/logger");
const router = (0, express_1.Router)();
// Barberos
router.get('/barberos', async (req, res) => {
    try {
        const barberos = await prisma_1.prisma.barbero.findMany({
            where: { empresa_id: req.empresa.id },
            include: { usuario: true }
        });
        res.json(barberos);
    }
    catch (error) {
        logger_1.winstonLogger.error(`Error obteniendo barberos: ${error.message}`);
        res.status(500).json({ error: 'Error al obtener barberos' });
    }
});
router.post('/barberos', async (req, res) => {
    const { nombre, especialidad, usuario_id } = req.body;
    try {
        const barbero = await prisma_1.prisma.barbero.create({
            data: {
                empresa_id: req.empresa.id,
                nombre,
                especialidad,
                usuario_id,
                activo: true
            }
        });
        res.status(201).json(barbero);
    }
    catch (error) {
        logger_1.winstonLogger.error(`Error creando barbero: ${error.message}`);
        res.status(400).json({ error: 'No se pudo crear el barbero' });
    }
});
// Servicios
router.get('/servicios', async (req, res) => {
    try {
        const servicios = await prisma_1.prisma.servicio.findMany({
            where: { empresa_id: req.empresa.id }
        });
        res.json(servicios);
    }
    catch (error) {
        logger_1.winstonLogger.error(`Error obteniendo servicios: ${error.message}`);
        res.status(500).json({ error: 'Error al obtener servicios' });
    }
});
router.post('/servicios', async (req, res) => {
    const { nombre, descripcion, precio, duracion_minutos } = req.body;
    try {
        const servicio = await prisma_1.prisma.servicio.create({
            data: {
                empresa_id: req.empresa.id,
                nombre,
                descripcion,
                precio,
                duracion_minutos: parseInt(duracion_minutos) || 30,
                activo: true
            }
        });
        res.status(201).json(servicio);
    }
    catch (error) {
        logger_1.winstonLogger.error(`Error creando servicio: ${error.message}`);
        res.status(400).json({ error: 'No se pudo crear el servicio' });
    }
});
// Citas Barbería
router.get('/citas', async (req, res) => {
    try {
        const citas = await prisma_1.prisma.citaBarberia.findMany({
            where: { empresa_id: req.empresa.id },
            include: {
                contacto: true,
                barbero: true,
                servicio: true
            },
            orderBy: { fecha_hora: 'asc' }
        });
        res.json(citas);
    }
    catch (error) {
        logger_1.winstonLogger.error(`Error obteniendo citas barbería: ${error.message}`);
        res.status(500).json({ error: 'Error al obtener citas' });
    }
});
router.post('/citas', async (req, res) => {
    const { contacto_id, barbero_id, servicio_id, fecha_hora, notas } = req.body;
    try {
        const cita = await prisma_1.prisma.citaBarberia.create({
            data: {
                empresa_id: req.empresa.id,
                contacto_id,
                barbero_id,
                servicio_id,
                fecha_hora: new Date(fecha_hora),
                estado: 'programada',
                notas
            }
        });
        res.status(201).json(cita);
    }
    catch (error) {
        logger_1.winstonLogger.error(`Error creando cita barbería: ${error.message}`);
        res.status(400).json({ error: 'No se pudo programar la cita' });
    }
});
exports.rutasBarberia = router;
