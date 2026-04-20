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
      const config: any = empresa.configuracion || {};
      return res.json(config.automatizaciones || []);
    }

    if (req.method === 'POST') {
      const { automatizaciones } = req.body;
      const nuevaConfig: any = {
        ...(empresa.configuracion as any || {}),
        automatizaciones
      };

      const actualizada = await prisma.empresa.update({
        where: { id: empresa.id },
        data: { configuracion: nuevaConfig }
      });

      return res.json(actualizada.configuracion);
    }

    return res.status(405).json({ error: 'Método no permitido' });
  } catch (error: any) {
    winstonLogger.error(`Error en API Automatizaciones: ${error.message}`);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
