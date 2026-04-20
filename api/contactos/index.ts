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
      const contactos = await prisma.contacto.findMany({
        where: { empresa_id: empresa.id },
        orderBy: { creado_en: 'desc' }
      });
      return res.json(contactos);
    }

    if (req.method === 'POST') {
      const { nombre, telefono, email, etiquetas, notas } = req.body;
      const contacto = await prisma.contacto.create({
        data: {
          empresa_id: empresa.id,
          nombre,
          telefono,
          email,
          etiquetas,
          notas
        }
      });
      return res.status(201).json(contacto);
    }

    return res.status(405).json({ error: 'Método no permitido' });
  } catch (error: any) {
    winstonLogger.error(`Error en API contactos: ${error.message}`);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
