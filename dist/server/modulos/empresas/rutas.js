"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rutasEmpresas = void 0;
const express_1 = require("express");
const prisma_1 = require("../../utilidades/prisma");
const logger_1 = require("../../utilidades/logger");
const router = (0, express_1.Router)();
// Obtener detalles de la empresa actual
router.get('/perfil', async (req, res) => {
    try {
        const empresa = await prisma_1.prisma.empresa.findUnique({
            where: { id: req.empresa?.id }
        });
        res.json(empresa);
    }
    catch (error) {
        logger_1.winstonLogger.error(`Error obteniendo perfil: ${error.message}`);
        res.status(500).json({ error: 'Error al obtener datos de la empresa' });
    }
});
// Actualizar empresa
router.put('/', async (req, res) => {
    const { nombre, tipo, logo_url, configuracion } = req.body;
    try {
        const empresa = await prisma_1.prisma.empresa.update({
            where: { id: req.empresa.id },
            data: {
                nombre,
                tipo,
                logo_url,
                configuracion,
                actualizado_en: new Date()
            }
        });
        res.json(empresa);
    }
    catch (error) {
        logger_1.winstonLogger.error(`Error actualizando empresa: ${error.message}`);
        res.status(400).json({ error: 'No se pudo actualizar la empresa' });
    }
});
// Obtener todas las empresas (solo para superadmin global si existiera)
router.get('/', async (req, res) => {
    try {
        const empresas = await prisma_1.prisma.empresa.findMany();
        res.json(empresas);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.rutasEmpresas = router;
