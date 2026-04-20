import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const identificarTenant = async (req: any, res: Response, next: NextFunction) => {
  const { slug } = req.params;

  if (!slug || slug === 'api') {
    return next();
  }

  try {
    const empresa = await prisma.empresa.findUnique({
      where: { slug }
    });

    if (!empresa) {
      return res.status(404).json({ error: 'Empresa no encontrada' });
    }

    req.empresa = empresa;
    next();
  } catch (error) {
    next(error);
  }
};
