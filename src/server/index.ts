import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { winstonLogger } from './utilidades/logger';
import { identificarTenant } from './middleware/identificarTenant';
import { rutasEmpresas } from './modulos/empresas/rutas';
import { rutasAutenticacion } from './modulos/autenticacion/rutas';
import { rutasContactos } from './modulos/contactos/rutas';
import { rutasWhatsApp } from './modulos/whatsapp/rutas';
import { rutasMensajes } from './modulos/mensajes/rutas';
import { rutasCDA } from './modulos/cda/rutas';
import { rutasBarberia } from './modulos/barberia/rutas';
import { rutasMonedas } from './modulos/monedas/rutas';
import { rutasAPIKeys } from './modulos/api_keys/rutas';
import { rutasAutomatizaciones } from './modulos/automatizaciones/rutas';

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
app.use('/api/mensajes', rutasMensajes);
app.use('/api/cda', rutasCDA);
app.use('/api/barberia', rutasBarberia);
app.use('/api/monedas', rutasMonedas);
app.use('/api/api-keys', rutasAPIKeys);
app.use('/api/automatizaciones', rutasAutomatizaciones);

// Manejo de errores global
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  winstonLogger.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor', mensaje: err.message });
});

app.listen(puerto, () => {
  winstonLogger.info(`Servidor backend ejecutándose en el puerto ${puerto}`);
});

export default app;
