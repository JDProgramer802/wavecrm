"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rutasWhatsApp = void 0;
const express_1 = require("express");
const prisma_1 = require("../../utilidades/prisma");
const logger_1 = require("../../utilidades/logger");
const router = (0, express_1.Router)();
// Obtener estado de la sesión de WhatsApp
router.get('/estado', async (req, res) => {
    try {
        const sesion = await prisma_1.prisma.sesionWhatsapp.findFirst({
            where: { empresa_id: req.empresa.id }
        });
        if (!sesion) {
            return res.json({ estado: 'desconectado', qr: null });
        }
        res.json({
            estado: sesion.estado,
            qr: sesion.qr_code,
            actualizado_en: sesion.actualizado_en
        });
    }
    catch (error) {
        logger_1.winstonLogger.error(`Error obteniendo estado WA: ${error.message}`);
        res.status(500).json({ error: 'Error al obtener estado de WhatsApp' });
    }
});
// Generar nuevo QR o reconectar
router.post('/conectar', async (req, res) => {
    try {
        // Aquí se llamaría al worker de Baileys para iniciar el proceso
        // Por ahora simulamos la creación de la sesión en la base de datos
        const sesion = await prisma_1.prisma.sesionWhatsapp.upsert({
            where: {
                empresa_id_nombre_sesion: {
                    empresa_id: req.empresa.id,
                    nombre_sesion: 'principal'
                }
            },
            update: { estado: 'iniciando', actualizado_en: new Date() },
            create: {
                empresa_id: req.empresa.id,
                nombre_sesion: 'principal',
                estado: 'iniciando'
            }
        });
        res.json({ mensaje: 'Proceso de conexión iniciado', sesion });
    }
    catch (error) {
        logger_1.winstonLogger.error(`Error conectando WA: ${error.message}`);
        res.status(500).json({ error: 'Error al iniciar conexión de WhatsApp' });
    }
});
// Desconectar sesión
router.post('/desconectar', async (req, res) => {
    try {
        await prisma_1.prisma.sesionWhatsapp.update({
            where: {
                empresa_id_nombre_sesion: {
                    empresa_id: req.empresa.id,
                    nombre_sesion: 'principal'
                }
            },
            data: { estado: 'desconectado', qr_code: null, actualizado_en: new Date() }
        });
        res.json({ mensaje: 'Sesión desconectada exitosamente' });
    }
    catch (error) {
        logger_1.winstonLogger.error(`Error desconectando WA: ${error.message}`);
        res.status(500).json({ error: 'Error al desconectar WhatsApp' });
    }
});
exports.rutasWhatsApp = router;
