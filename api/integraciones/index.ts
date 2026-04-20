import { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../src/server/utilidades/prisma';
import { winstonLogger } from '../src/server/utilidades/logger';
import crypto from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const apiKey = req.headers['x-api-key'] as string;

  if (!apiKey) {
    return res.status(401).json({ error: 'X-API-KEY es requerida' });
  }

  try {
    const claveHash = crypto.createHash('sha256').update(apiKey).digest('hex');
    const claveValida = await prisma.claveAPI.findFirst({
      where: { clave_hash: claveHash },
      include: { empresa: true }
    });

    if (!claveValida) {
      return res.status(401).json({ error: 'Clave API inválida' });
    }

    const empresa = claveValida.empresa;

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

    // Endpoint para crear contacto vía API pública
    if (req.method === 'POST' && req.url?.includes('/contactos')) {
      const { nombre, telefono, email, etiquetas, notas } = req.body;
      const contacto = await prisma.contacto.create({
        data: {
          empresa_id: empresa.id,
          nombre,
          telefono,
          email,
          etiquetas: etiquetas || ['API'],
          notas: notas || 'Creado vía API Pública'
        }
      });
      return res.status(201).json(contacto);
    }

    return res.status(405).json({ error: 'Método no permitido' });
  } catch (error: any) {
    winstonLogger.error(`Error en API Integraciones: ${error.message}`);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

