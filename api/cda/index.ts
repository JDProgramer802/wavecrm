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
      const { modulo } = req.query;

      if (modulo === 'vehiculos') {
        const vehiculos = await prisma.vehiculo.findMany({
          where: { empresa_id: empresa.id },
          include: { contacto: true, tipo: true }
        });
        return res.json(vehiculos);
      }

      const citas = await prisma.citaCDA.findMany({
        where: { empresa_id: empresa.id },
        include: { vehiculo: { include: { contacto: true } } },
        orderBy: { fecha_hora: 'asc' }
      });
      return res.json(citas);
    }

    if (req.method === 'POST') {
      const { modulo } = req.query;

      if (modulo === 'vehiculos') {
        const { contacto_id, placa, tipo_vehiculo_id, marca, modelo, vencimiento_soat, vencimiento_tecnomecanica } = req.body;
        const vehiculo = await prisma.vehiculo.create({
          data: {
            empresa_id: empresa.id,
            contacto_id,
            placa,
            tipo_vehiculo_id,
            marca,
            modelo,
            vencimiento_soat: vencimiento_soat ? new Date(vencimiento_soat) : null,
            vencimiento_tecnomecanica: vencimiento_tecnomecanica ? new Date(vencimiento_tecnomecanica) : null
          }
        });
        return res.status(201).json(vehiculo);
      }

      const { vehiculo_id, fecha_hora, notas } = req.body;
      const cita = await prisma.citaCDA.create({
        data: {
          empresa_id: empresa.id,
          vehiculo_id,
          fecha_hora: new Date(fecha_hora),
          estado: 'programada',
          notas
        }
      });
      return res.status(201).json(cita);
    }

    return res.status(405).json({ error: 'Método no permitido' });
  } catch (error: any) {
    winstonLogger.error(`Error en API CDA: ${error.message}`);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
