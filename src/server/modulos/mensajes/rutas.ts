import { Router } from 'express';
import { prisma } from '../../utilidades/prisma';
import { winstonLogger } from '../../utilidades/logger';

const router = Router();

// Obtener mensajes de una conversación
router.get('/:conversacionId', async (req: any, res) => {
  const { conversacionId } = req.params;
  try {
    const mensajes = await prisma.mensaje.findMany({
      where: { 
        conversacion_id: conversacionId,
        empresa_id: req.empresa.id 
      },
      orderBy: { creado_en: 'asc' }
    });
    res.json(mensajes);
  } catch (error: any) {
    winstonLogger.error(`Error obteniendo mensajes: ${error.message}`);
    res.status(500).json({ error: 'Error al obtener mensajes' });
  }
});

// Enviar nuevo mensaje
router.post('/', async (req: any, res) => {
  const { conversacion_id, contenido, tipo, metadata } = req.body;
  try {
    const mensaje = await prisma.mensaje.create({
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
  } catch (error: any) {
    winstonLogger.error(`Error enviando mensaje: ${error.message}`);
    res.status(400).json({ error: 'No se pudo enviar el mensaje' });
  }
});

export const rutasMensajes = router;
