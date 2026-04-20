"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = require("./utilidades/logger");
const identificarTenant_1 = require("./middleware/identificarTenant");
const rutas_1 = require("./modulos/empresas/rutas");
const rutas_2 = require("./modulos/autenticacion/rutas");
const rutas_3 = require("./modulos/contactos/rutas");
const rutas_4 = require("./modulos/whatsapp/rutas");
dotenv_1.default.config();
const app = (0, express_1.default)();
const puerto = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Middleware para logs
app.use((req, res, next) => {
    logger_1.winstonLogger.info(`${req.method} ${req.url}`);
    next();
});
// Middleware Multi-tenant
app.use('/:slug', identificarTenant_1.identificarTenant);
// Rutas de la API
app.use('/api/autenticacion', rutas_2.rutasAutenticacion);
app.use('/api/empresas', rutas_1.rutasEmpresas);
app.use('/api/contactos', rutas_3.rutasContactos);
app.use('/api/whatsapp', rutas_4.rutasWhatsApp);
// Manejo de errores global
app.use((err, req, res, next) => {
    logger_1.winstonLogger.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor', mensaje: err.message });
});
app.listen(puerto, () => {
    logger_1.winstonLogger.info(`Servidor backend ejecutándose en el puerto ${puerto}`);
});
exports.default = app;
