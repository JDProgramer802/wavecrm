import { Router } from 'express';
import { prisma } from '../../utilidades/prisma';
import { winstonLogger } from '../../utilidades/logger';

const router = Router();

// Obtener estado de la sesión de WhatsApp
router.get('/estado', async (req: any, res) => {
  try {
    const sesion = await prisma.sesionWhatsapp.findFirst({
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
  } catch (error: any) {
    winstonLogger.error(`Error obteniendo estado WA: ${error.message}`);
    res.status(500).json({ error: 'Error al obtener estado de WhatsApp' });
  }
});

// Generar nuevo QR o reconectar
router.post('/conectar', async (req: any, res) => {
  try {
    // Aquí se llamaría al worker de Baileys para iniciar el proceso
    // Por ahora simulamos la creación de la sesión en la base de datos
    const sesion = await prisma.sesionWhatsapp.upsert({
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
  } catch (error: any) {
    winstonLogger.error(`Error conectando WA: ${error.message}`);
    res.status(500).json({ error: 'Error al iniciar conexión de WhatsApp' });
  }
});

// Desconectar sesión
router.post('/desconectar', async (req: any, res) => {
  try {
    await prisma.sesionWhatsapp.update({
      where: { 
        empresa_id_nombre_sesion: {
          empresa_id: req.empresa.id,
          nombre_sesion: 'principal'
        }
      },
      data: { estado: 'desconectado', qr_code: null, actualizado_en: new Date() }
    });

    res.json({ mensaje: 'Sesión desconectada exitosamente' });
  } catch (error: any) {
    winstonLogger.error(`Error desconectando WA: ${error.message}`);
    res.status(500).json({ error: 'Error al desconectar WhatsApp' });
  }
});

export const rutasWhatsApp = router;
