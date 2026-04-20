import { makeWASocket, useMultiFileAuthState, DisconnectReason, Browsers } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import { prisma } from '../../utilidades/prisma';
import { winstonLogger } from '../../utilidades/logger';
import path from 'path';
import fs from 'fs';

export class WhatsAppWorker {
  private static instancias: Map<string, any> = new Map();

  static async iniciarConexion(empresaId: string, nombreSesion: string = 'principal') {
    const sesionKey = `${empresaId}:${nombreSesion}`;
    
    if (this.instancias.has(sesionKey)) {
      return this.instancias.get(sesionKey);
    }

    const authFolder = path.join(process.cwd(), 'workers', 'baileys', 'auth', sesionKey);
    if (!fs.existsSync(authFolder)) {
      fs.mkdirSync(authFolder, { recursive: true });
    }

    const { state, saveCreds } = await useMultiFileAuthState(authFolder);

    const sock = makeWASocket({
      auth: state,
      printQRInTerminal: false,
      browser: Browsers.macOS('Desktop'),
      syncFullHistory: false
    });

    this.instancias.set(sesionKey, sock);

    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        winstonLogger.info(`Nuevo código QR generado para la empresa ${empresaId}`);
        await prisma.sesionWhatsapp.update({
          where: { empresa_id_nombre_sesion: { empresa_id: empresaId, nombre_sesion: nombreSesion } },
          data: { qr_code: qr, estado: 'esperando_qr' }
        });
      }

      if (connection === 'close') {
        const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
        winstonLogger.info(`Conexión cerrada para ${empresaId}. Reconectar: ${shouldReconnect}`);
        
        await prisma.sesionWhatsapp.update({
          where: { empresa_id_nombre_sesion: { empresa_id: empresaId, nombre_sesion: nombreSesion } },
          data: { estado: 'desconectado', qr_code: null }
        });

        if (shouldReconnect) {
          this.iniciarConexion(empresaId, nombreSesion);
        } else {
          this.instancias.delete(sesionKey);
        }
      } else if (connection === 'open') {
        winstonLogger.info(`Conexión abierta exitosamente para ${empresaId}`);
        await prisma.sesionWhatsapp.update({
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
            winstonLogger.info(`Nuevo mensaje recibido en ${empresaId} de ${msg.key.remoteJid}`);
            // Aquí iría la lógica para guardar el mensaje y disparar automatizaciones
          }
        }
      }
    });

    return sock;
  }

  static async enviarMensaje(empresaId: string, jid: string, contenido: any, nombreSesion: string = 'principal') {
    const sesionKey = `${empresaId}:${nombreSesion}`;
    const sock = this.instancias.get(sesionKey);

    if (!sock) {
      throw new Error('Sesión no encontrada o no iniciada');
    }

    return await sock.sendMessage(jid, contenido);
  }
}
