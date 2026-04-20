import { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../src/server/utilidades/prisma';
import { winstonLogger } from '../src/server/utilidades/logger';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { slug } = req.query;

  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ error: 'Slug de empresa es requerido' });
  }

  try {
    const empresa = await prisma.empresa.findUnique({
      where: { slug }
    });

    if (!empresa) {
      return res.status(404).json({ error: 'Empresa no encontrada' });
    }

    if (req.method === 'GET') {
      const { conversacionId } = req.query;
      const mensajes = await prisma.mensaje.findMany({
        where: { 
          conversacion_id: conversacionId as string,
          empresa_id: empresa.id 
        },
        orderBy: { creado_en: 'asc' }
      });
      return res.json(mensajes);
    }

    if (req.method === 'POST') {
      const { conversacion_id, contenido, tipo, metadata } = req.body;
      const mensaje = await prisma.mensaje.create({
        data: {
          empresa_id: empresa.id,
          conversacion_id,
          es_entrante: false,
          contenido,
          tipo: tipo || 'texto',
          metadata: metadata || {},
          estado: 'enviado'
        }
      });
      return res.status(201).json(mensaje);
    }

    return res.status(405).json({ error: 'Método no permitido' });
  } catch (error: any) {
    winstonLogger.error(`Error en API Mensajes: ${error.message}`);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
