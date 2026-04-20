import { Router } from 'express';
import { prisma } from '../../utilidades/prisma';
import { winstonLogger } from '../../utilidades/logger';

const router = Router();

// Obtener detalles de la empresa actual
router.get('/perfil', async (req: any, res) => {
  try {
    const empresa = await prisma.empresa.findUnique({
      where: { id: req.empresa?.id }
    });
    res.json(empresa);
  } catch (error: any) {
    winstonLogger.error(`Error obteniendo perfil: ${error.message}`);
    res.status(500).json({ error: 'Error al obtener datos de la empresa' });
  }
});

// Actualizar empresa
router.put('/', async (req: any, res) => {
  const { nombre, tipo, logo_url, configuracion } = req.body;
  
  try {
    const empresa = await prisma.empresa.update({
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
  } catch (error: any) {
    winstonLogger.error(`Error actualizando empresa: ${error.message}`);
    res.status(400).json({ error: 'No se pudo actualizar la empresa' });
  }
});

// Obtener todas las empresas (solo para superadmin global si existiera)
router.get('/', async (req: any, res) => {
  try {
    const empresas = await prisma.empresa.findMany();
    res.json(empresas);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export const rutasEmpresas = router;
