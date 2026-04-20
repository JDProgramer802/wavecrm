"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rutasContactos = void 0;
const express_1 = require("express");
const prisma_1 = require("../../utilidades/prisma");
const logger_1 = require("../../utilidades/logger");
const router = (0, express_1.Router)();
// Obtener todos los contactos de la empresa
router.get('/', async (req, res) => {
    try {
        const contactos = await prisma_1.prisma.contacto.findMany({
            where: { empresa_id: req.empresa?.id },
            orderBy: { creado_en: 'desc' }
        });
        res.json(contactos);
    }
    catch (error) {
        logger_1.winstonLogger.error(`Error obteniendo contactos: ${error.message}`);
        res.status(500).json({ error: 'Error al obtener contactos' });
    }
});
// Crear nuevo contacto
router.post('/', async (req, res) => {
    const { nombre, telefono, email, etiquetas, notas } = req.body;
    try {
        const contacto = await prisma_1.prisma.contacto.create({
            data: {
                empresa_id: req.empresa.id,
                nombre,
                telefono,
                email,
                etiquetas,
                notas
            }
        });
        res.status(201).json(contacto);
    }
    catch (error) {
        logger_1.winstonLogger.error(`Error creando contacto: ${error.message}`);
        res.status(400).json({ error: 'No se pudo crear el contacto' });
    }
});
// Actualizar contacto
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, telefono, email, etiquetas, notas } = req.body;
    try {
        const contacto = await prisma_1.prisma.contacto.update({
            where: {
                id,
                empresa_id: req.empresa.id
            },
            data: { nombre, telefono, email, etiquetas, notas }
        });
        res.json(contacto);
    }
    catch (error) {
        logger_1.winstonLogger.error(`Error actualizando contacto: ${error.message}`);
        res.status(400).json({ error: 'No se pudo actualizar el contacto' });
    }
});
// Eliminar contacto
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma_1.prisma.contacto.delete({
            where: {
                id,
                empresa_id: req.empresa.id
            }
        });
        res.status(204).send();
    }
    catch (error) {
        logger_1.winstonLogger.error(`Error eliminando contacto: ${error.message}`);
        res.status(400).json({ error: 'No se pudo eliminar el contacto' });
    }
});
exports.rutasContactos = router;
