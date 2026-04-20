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
      const claves = await prisma.claveAPI.findMany({
        where: { empresa_id: empresa.id },
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
      return res.json(claves);
    }

    return res.status(405).json({ error: 'Método no permitido' });
  } catch (error: any) {
    winstonLogger.error(`Error en API Claves: ${error.message}`);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
