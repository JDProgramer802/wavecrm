import { Router } from 'express';
import { prisma } from '../../utilidades/prisma';
import { winstonLogger } from '../../utilidades/logger';

const router = Router();

// Obtener todas las monedas soportadas
router.get('/', async (req, res) => {
  try {
    const monedas = await prisma.moneda.findMany();
    res.json(monedas);
  } catch (error: any) {
    winstonLogger.error(`Error obteniendo monedas: ${error.message}`);
    res.status(500).json({ error: 'Error al obtener monedas' });
  }
});

// Obtener tasas de cambio actuales
router.get('/tasas', async (req, res) => {
  try {
    const tasas = await prisma.tasaCambio.findMany({
      include: { origen: true, destino: true }
    });
    res.json(tasas);
  } catch (error: any) {
    winstonLogger.error(`Error obteniendo tasas: ${error.message}`);
    res.status(500).json({ error: 'Error al obtener tasas de cambio' });
  }
});

export const rutasMonedas = router;
