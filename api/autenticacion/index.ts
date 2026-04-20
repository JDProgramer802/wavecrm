import { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../src/server/utilidades/prisma';
import bcrypt from 'bcrypt';
import { winstonLogger } from '../src/server/utilidades/logger';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    const { email, contrasena, slug } = req.body;

    try {
      const empresa = await prisma.empresa.findUnique({ where: { slug } });
      if (!empresa) {
        return res.status(404).json({ error: 'Empresa no encontrada' });
      }

      const usuario = await prisma.usuario.findFirst({
        where: { email, empresa_id: empresa.id }
      });

      if (!usuario || !(await bcrypt.compare(contrasena, usuario.contrasena))) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      await prisma.usuario.update({
        where: { id: usuario.id },
        data: { ultimo_acceso: new Date() }
      });

      return res.json({ 
        usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol_id: usuario.rol_id },
        empresa: { id: empresa.id, nombre: empresa.nombre, slug: empresa.slug }
      });
    } catch (error: any) {
      winstonLogger.error(`Error en API login: ${error.message}`);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  return res.status(405).json({ error: 'Método no permitido' });
}
