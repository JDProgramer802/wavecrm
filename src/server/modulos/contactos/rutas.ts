import { Router } from 'express';
import { prisma } from '../../utilidades/prisma';
import { winstonLogger } from '../../utilidades/logger';

const router = Router();

// Obtener todos los contactos de la empresa
router.get('/', async (req: any, res) => {
  try {
    const contactos = await prisma.contacto.findMany({
      where: { empresa_id: req.empresa?.id },
      orderBy: { creado_en: 'desc' }
    });
    res.json(contactos);
  } catch (error: any) {
    winstonLogger.error(`Error obteniendo contactos: ${error.message}`);
    res.status(500).json({ error: 'Error al obtener contactos' });
  }
});

// Crear nuevo contacto
router.post('/', async (req: any, res) => {
  const { nombre, telefono, email, etiquetas, notas } = req.body;
  
  try {
    const contacto = await prisma.contacto.create({
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
  } catch (error: any) {
    winstonLogger.error(`Error creando contacto: ${error.message}`);
    res.status(400).json({ error: 'No se pudo crear el contacto' });
  }
});

// Actualizar contacto
router.put('/:id', async (req: any, res) => {
  const { id } = req.params;
  const { nombre, telefono, email, etiquetas, notas } = req.body;

  try {
    const contacto = await prisma.contacto.update({
      where: { 
        id,
        empresa_id: req.empresa.id 
      },
      data: { nombre, telefono, email, etiquetas, notas }
    });
    res.json(contacto);
  } catch (error: any) {
    winstonLogger.error(`Error actualizando contacto: ${error.message}`);
    res.status(400).json({ error: 'No se pudo actualizar el contacto' });
  }
});

// Eliminar contacto
router.delete('/:id', async (req: any, res) => {
  const { id } = req.params;

  try {
    await prisma.contacto.delete({
      where: { 
        id,
        empresa_id: req.empresa.id 
      }
    });
    res.status(204).send();
  } catch (error: any) {
    winstonLogger.error(`Error eliminando contacto: ${error.message}`);
    res.status(400).json({ error: 'No se pudo eliminar el contacto' });
  }
});

export const rutasContactos = router;
