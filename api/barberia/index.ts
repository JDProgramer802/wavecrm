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

    const { modulo } = req.query;

    if (req.method === 'GET') {
      if (modulo === 'barberos') {
        const barberos = await prisma.barbero.findMany({
          where: { empresa_id: empresa.id },
          include: { usuario: true }
        });
        return res.json(barberos);
      }

      if (modulo === 'servicios') {
        const servicios = await prisma.servicio.findMany({
          where: { empresa_id: empresa.id }
        });
        return res.json(servicios);
      }

      const citas = await prisma.citaBarberia.findMany({
        where: { empresa_id: empresa.id },
        include: { contacto: true, barbero: true, servicio: true },
        orderBy: { fecha_hora: 'asc' }
      });
      return res.json(citas);
    }

    if (req.method === 'POST') {
      if (modulo === 'barberos') {
        const { nombre, especialidad, usuario_id } = req.body;
        const barbero = await prisma.barbero.create({
          data: { empresa_id: empresa.id, nombre, especialidad, usuario_id, activo: true }
        });
        return res.status(201).json(barbero);
      }

      if (modulo === 'servicios') {
        const { nombre, descripcion, precio, duracion_minutos } = req.body;
        const servicio = await prisma.servicio.create({
          data: { 
            empresa_id: empresa.id, 
            nombre, 
            descripcion, 
            precio, 
            duracion_minutos: parseInt(duracion_minutos) || 30, 
            activo: true 
          }
        });
        return res.status(201).json(servicio);
      }

      const { contacto_id, barbero_id, servicio_id, fecha_hora, notas } = req.body;
      const cita = await prisma.citaBarberia.create({
        data: {
          empresa_id: empresa.id,
          contacto_id,
          barbero_id,
          servicio_id,
          fecha_hora: new Date(fecha_hora),
          estado: 'programada',
          notas
        }
      });
      return res.status(201).json(cita);
    }

    return res.status(405).json({ error: 'Método no permitido' });
  } catch (error: any) {
    winstonLogger.error(`Error en API Barbería: ${error.message}`);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
