import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { winstonLogger } from './utilidades/logger';
import { identificarTenant } from './middleware/identificarTenant';
import { rutasEmpresas } from './modulos/empresas/rutas';
import { rutasAutenticacion } from './modulos/autenticacion/rutas';
import { rutasContactos } from './modulos/contactos/rutas';
import { rutasWhatsApp } from './modulos/whatsapp/rutas';

dotenv.config();

const app = express();
const puerto = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Middleware para logs
app.use((req, res, next) => {
  winstonLogger.info(`${req.method} ${req.url}`);
  next();
});

// Middleware Multi-tenant
app.use('/:slug', identificarTenant);

// Rutas de la API
app.use('/api/autenticacion', rutasAutenticacion);
app.use('/api/empresas', rutasEmpresas);
app.use('/api/contactos', rutasContactos);
app.use('/api/whatsapp', rutasWhatsApp);

// Manejo de errores global
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  winstonLogger.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor', mensaje: err.message });
});

app.listen(puerto, () => {
  winstonLogger.info(`Servidor backend ejecutándose en el puerto ${puerto}`);
});

export default app;
