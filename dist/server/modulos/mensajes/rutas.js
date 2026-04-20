"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rutasMensajes = void 0;
const express_1 = require("express");
const prisma_1 = require("../../utilidades/prisma");
const logger_1 = require("../../utilidades/logger");
const router = (0, express_1.Router)();
// Obtener mensajes de una conversación
router.get('/:conversacionId', async (req, res) => {
    const { conversacionId } = req.params;
    try {
        const mensajes = await prisma_1.prisma.mensaje.findMany({
            where: {
                conversacion_id: conversacionId,
                empresa_id: req.empresa.id
            },
            orderBy: { creado_en: 'asc' }
        });
        res.json(mensajes);
    }
    catch (error) {
        logger_1.winstonLogger.error(`Error obteniendo mensajes: ${error.message}`);
        res.status(500).json({ error: 'Error al obtener mensajes' });
    }
});
// Enviar nuevo mensaje
router.post('/', async (req, res) => {
    const { conversacion_id, contenido, tipo, metadata } = req.body;
    try {
        const mensaje = await prisma_1.prisma.mensaje.create({
            data: {
                empresa_id: req.empresa.id,
                conversacion_id,
                es_entrante: false,
                contenido,
                tipo: tipo || 'texto',
                metadata: metadata || {},
                estado: 'enviado'
            }
        });
        // Aquí se dispararía el worker de WhatsApp para enviar el mensaje real
        res.status(201).json(mensaje);
    }
    catch (error) {
        logger_1.winstonLogger.error(`Error enviando mensaje: ${error.message}`);
        res.status(400).json({ error: 'No se pudo enviar el mensaje' });
    }
});
exports.rutasMensajes = router;
