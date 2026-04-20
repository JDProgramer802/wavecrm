import { Router } from 'express';
import { prisma } from '../../utilidades/prisma';
import { winstonLogger } from '../../utilidades/logger';
import crypto from 'crypto';

const router = Router();

// Listar claves API
router.get('/', async (req: any, res) => {
  try {
    const claves = await prisma.claveAPI.findMany({
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
  } catch (error: any) {
    winstonLogger.error(`Error obteniendo claves API: ${error.message}`);
    res.status(500).json({ error: 'Error al obtener claves API' });
  }
});

// Crear clave API
router.post('/', async (req: any, res) => {
  const { nombre, ambitos, expira_en } = req.body;
  try {
    const prefijo = 'wc_';
    const claveAleatoria = crypto.randomBytes(32).toString('hex');
    const claveCompleta = `${prefijo}${claveAleatoria}`;
    const clave_hash = crypto.createHash('sha256').update(claveCompleta).digest('hex');

    const nuevaClave = await prisma.claveAPI.create({
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
  } catch (error: any) {
    winstonLogger.error(`Error creando clave API: ${error.message}`);
    res.status(400).json({ error: 'No se pudo crear la clave API' });
  }
});

// Eliminar clave API
router.delete('/:id', async (req: any, res) => {
  const { id } = req.params;
  try {
    await prisma.claveAPI.delete({
      where: { 
        id,
        empresa_id: req.empresa.id 
      }
    });
    res.status(204).send();
  } catch (error: any) {
    winstonLogger.error(`Error eliminando clave API: ${error.message}`);
    res.status(400).json({ error: 'No se pudo eliminar la clave API' });
  }
});

export const rutasAPIKeys = router;
