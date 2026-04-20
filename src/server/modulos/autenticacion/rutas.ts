import { Router } from 'express';
import { prisma } from '../../utilidades/prisma';
import bcrypt from 'bcrypt';
import { winstonLogger } from '../../utilidades/logger';

const router = Router();

// Registro de nueva empresa y usuario administrador
router.post('/registro', async (req, res) => {
  const { nombreEmpresa, slug, tipo, nombreAdmin, email, contrasena } = req.body;

  try {
    const resultado = await prisma.$transaction(async (tx) => {
      const empresa = await tx.empresa.create({
        data: {
          nombre: nombreEmpresa,
          slug,
          tipo,
          configuracion: {}
        }
      });

      const contrasenaHash = await bcrypt.hash(contrasena, 10);

      const usuario = await tx.usuario.create({
        data: {
          empresa_id: empresa.id,
          nombre: nombreAdmin,
          email,
          contrasena: contrasenaHash,
          rol_id: 100, // Superadmin
        }
      });

      return { empresa, usuario };
    });

    res.status(201).json({ 
      mensaje: 'Empresa y usuario creados exitosamente',
      empresa: resultado.empresa,
      usuario: { id: resultado.usuario.id, nombre: resultado.usuario.nombre, email: resultado.usuario.email }
    });
  } catch (error: any) {
    winstonLogger.error(`Error en registro: ${error.message}`);
    res.status(400).json({ error: 'No se pudo completar el registro', detalle: error.message });
  }
});

// Login de usuario
router.post('/login', async (req, res) => {
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

    // Actualizar último acceso
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { ultimo_acceso: new Date() }
    });

    res.json({ 
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol_id: usuario.rol_id },
      empresa: { id: empresa.id, nombre: empresa.nombre, slug: empresa.slug }
    });
  } catch (error: any) {
    winstonLogger.error(`Error en login: ${error.message}`);
    res.status(500).json({ error: 'Error en el servidor durante el login' });
  }
});

export const rutasAutenticacion = router;
