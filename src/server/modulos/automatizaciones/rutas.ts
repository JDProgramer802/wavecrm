import { Router } from 'express';
import { prisma } from '../../utilidades/prisma';
import { winstonLogger } from '../../utilidades/logger';

const router = Router();

// Listar automatizaciones
router.get('/', async (req: any, res) => {
  try {
    const automatizaciones = await prisma.empresa.findUnique({
      where: { id: req.empresa.id },
      select: { configuracion: true }
    });
    // Las automatizaciones se guardan en el JSON de configuración por ahora
    const config: any = automatizaciones?.configuracion || {};
    res.json(config.automatizaciones || []);
  } catch (error: any) {
    winstonLogger.error(`Error obteniendo automatizaciones: ${error.message}`);
    res.status(500).json({ error: 'Error al obtener automatizaciones' });
  }
});

// Crear/Actualizar automatización
router.post('/', async (req: any, res) => {
  const { automatizaciones } = req.body;
  try {
    const empresa = await prisma.empresa.findUnique({
      where: { id: req.empresa.id }
    });

    const nuevaConfig: any = {
      ...(empresa?.configuracion as any || {}),
      automatizaciones
    };

    const actualizada = await prisma.empresa.update({
      where: { id: req.empresa.id },
      data: { configuracion: nuevaConfig }
    });

    res.json(actualizada.configuracion);
  } catch (error: any) {
    winstonLogger.error(`Error guardando automatización: ${error.message}`);
    res.status(400).json({ error: 'No se pudo guardar la automatización' });
  }
});

export const rutasAutomatizaciones = router;
