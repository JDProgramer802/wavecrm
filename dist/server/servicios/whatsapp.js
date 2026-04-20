"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsAppWorker = void 0;
const baileys_1 = require("@whiskeysockets/baileys");
const prisma_1 = require("../utilidades/prisma");
const logger_1 = require("../utilidades/logger");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class WhatsAppWorker {
    static async iniciarConexion(empresaId, nombreSesion = 'principal') {
        const sesionKey = `${empresaId}:${nombreSesion}`;
        if (this.instancias.has(sesionKey)) {
            return this.instancias.get(sesionKey);
        }
        const authFolder = path_1.default.join(process.cwd(), 'workers', 'baileys', 'auth', sesionKey);
        if (!fs_1.default.existsSync(authFolder)) {
            fs_1.default.mkdirSync(authFolder, { recursive: true });
        }
        const { state, saveCreds } = await (0, baileys_1.useMultiFileAuthState)(authFolder);
        const sock = (0, baileys_1.makeWASocket)({
            auth: state,
            printQRInTerminal: false,
            browser: baileys_1.Browsers.macOS('Desktop'),
            syncFullHistory: false
        });
        this.instancias.set(sesionKey, sock);
        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update;
            if (qr) {
                logger_1.winstonLogger.info(`Nuevo código QR generado para la empresa ${empresaId}`);
                await prisma_1.prisma.sesionWhatsapp.update({
                    where: { empresa_id_nombre_sesion: { empresa_id: empresaId, nombre_sesion: nombreSesion } },
                    data: { qr_code: qr, estado: 'esperando_qr' }
                });
            }
            if (connection === 'close') {
                const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== baileys_1.DisconnectReason.loggedOut;
                logger_1.winstonLogger.info(`Conexión cerrada para ${empresaId}. Reconectar: ${shouldReconnect}`);
                await prisma_1.prisma.sesionWhatsapp.update({
                    where: { empresa_id_nombre_sesion: { empresa_id: empresaId, nombre_sesion: nombreSesion } },
                    data: { estado: 'desconectado', qr_code: null }
                });
                if (shouldReconnect) {
                    this.iniciarConexion(empresaId, nombreSesion);
                }
                else {
                    this.instancias.delete(sesionKey);
                }
            }
            else if (connection === 'open') {
                logger_1.winstonLogger.info(`Conexión abierta exitosamente para ${empresaId}`);
                await prisma_1.prisma.sesionWhatsapp.update({
                    where: { empresa_id_nombre_sesion: { empresa_id: empresaId, nombre_sesion: nombreSesion } },
                    data: { estado: 'conectado', qr_code: null, actualizado_en: new Date() }
                });
            }
        });
        sock.ev.on('creds.update', saveCreds);
        sock.ev.on('messages.upsert', async ({ messages, type }) => {
            if (type === 'notify') {
                for (const msg of messages) {
                    if (!msg.key.fromMe && msg.message) {
                        logger_1.winstonLogger.info(`Nuevo mensaje recibido en ${empresaId} de ${msg.key.remoteJid}`);
                        // Aquí iría la lógica para guardar el mensaje y disparar automatizaciones
                    }
                }
            }
        });
        return sock;
    }
    static async enviarMensaje(empresaId, jid, contenido, nombreSesion = 'principal') {
        const sesionKey = `${empresaId}:${nombreSesion}`;
        const sock = this.instancias.get(sesionKey);
        if (!sock) {
            throw new Error('Sesión no encontrada o no iniciada');
        }
        return await sock.sendMessage(jid, contenido);
    }
}
exports.WhatsAppWorker = WhatsAppWorker;
WhatsAppWorker.instancias = new Map();
