"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rutasAPIKeys = void 0;
const express_1 = require("express");
const prisma_1 = require("../../utilidades/prisma");
const logger_1 = require("../../utilidades/logger");
const crypto_1 = __importDefault(require("crypto"));
const router = (0, express_1.Router)();
// Listar claves API
router.get('/', async (req, res) => {
    try {
        const claves = await prisma_1.prisma.claveAPI.findMany({
            where: { empresa_id: req.empresa.id },
            select: {
                id: true,
                nombre: true,
                prefijo: true,
                ambitos: true,
                ultimo_uso: true,
                creado_en: true,
                expira_en: true
            }
        });
        res.json(claves);
    }
    catch (error) {
        logger_1.winstonLogger.error(`Error obteniendo claves API: ${error.message}`);
        res.status(500).json({ error: 'Error al obtener claves API' });
    }
});
// Crear clave API
router.post('/', async (req, res) => {
    const { nombre, ambitos, expira_en } = req.body;
    try {
        const prefijo = 'wc_';
        const claveAleatoria = crypto_1.default.randomBytes(32).toString('hex');
        const claveCompleta = `${prefijo}${claveAleatoria}`;
        const clave_hash = crypto_1.default.createHash('sha256').update(claveCompleta).digest('hex');
        const nuevaClave = await prisma_1.prisma.claveAPI.create({
            data: {
                empresa_id: req.empresa.id,
                nombre,
                clave_hash,
                prefijo,
                ambitos: ambitos || ['read', 'write'],
                expira_en: expira_en ? new Date(expira_en) : null
            }
        });
        res.status(201).json({
            ...nuevaClave,
            clave_visible: claveCompleta // Solo se muestra una vez al crearla
        });
    }
    catch (error) {
        logger_1.winstonLogger.error(`Error creando clave API: ${error.message}`);
        res.status(400).json({ error: 'No se pudo crear la clave API' });
    }
});
// Eliminar clave API
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma_1.prisma.claveAPI.delete({
            where: {
                id,
                empresa_id: req.empresa.id
            }
        });
        res.status(204).send();
    }
    catch (error) {
        logger_1.winstonLogger.error(`Error eliminando clave API: ${error.message}`);
        res.status(400).json({ error: 'No se pudo eliminar la clave API' });
    }
});
exports.rutasAPIKeys = router;
