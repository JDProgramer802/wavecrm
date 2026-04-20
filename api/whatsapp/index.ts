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
      const sesion = await prisma.sesionWhatsapp.findFirst({
        where: { empresa_id: empresa.id }
      });
      return res.json(sesion || { estado: 'desconectado', qr: null });
    }

    if (req.method === 'POST') {
      const { accion } = req.body;
      if (accion === 'conectar') {
        const sesion = await prisma.sesionWhatsapp.upsert({
          where: { 
            empresa_id_nombre_sesion: {
              empresa_id: empresa.id,
              nombre_sesion: 'principal'
            }
          },
          update: { estado: 'iniciando', actualizado_en: new Date() },
          create: {
            empresa_id: empresa.id,
            nombre_sesion: 'principal',
            estado: 'iniciando'
          }
        });
        return res.json(sesion);
      }
    }

    return res.status(405).json({ error: 'Método no permitido' });
  } catch (error: any) {
    winstonLogger.error(`Error en API whatsapp: ${error.message}`);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
