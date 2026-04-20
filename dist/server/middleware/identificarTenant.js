"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.identificarTenant = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const identificarTenant = async (req, res, next) => {
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
    }
    catch (error) {
        next(error);
    }
};
exports.identificarTenant = identificarTenant;
