# WaveCRM - Sistema SaaS Multi-tenant

Sistema completo de gestión CRM con integración de WhatsApp, diseñado para escalar en múltiples industrias.

## Características Principales
- **Arquitectura Multi-tenant**: Separación completa de datos por empresa mediante slugs.
- **WhatsApp con Baileys**: Integración directa con WhatsApp para atención multi-agente.
- **Sistema Modular**: Módulos específicos para CDA, Barberías y más.
- **Stack Moderno**: React 18, Node.js 20, Prisma, Supabase y Tailwind CSS.

## Instalación y Configuración Local

### Requisitos
- Node.js 20.x o superior
- PostgreSQL (o cuenta en Supabase)
- Redis (o cuenta en Upstash)

### Pasos
1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/JDProgramer802/wavecrm.git
   cd wavecrm
   ```

2. **Instalar dependencias**:
   ```bash
   npm run setup
   ```

3. **Configurar variables de entorno**:
   Copia `.env.example` a `.env` y completa tus credenciales.

4. **Base de Datos**:
   Ejecuta el contenido de `database/schema.sql` en tu editor SQL de Supabase.

5. **Ejecutar en desarrollo**:
   ```bash
   npm run dev
   ```

## Estructura del Proyecto
- `api/`: Rutas serverless para Vercel.
- `src/server/`: Lógica del backend Express para desarrollo local.
- `src/client/`: Aplicación frontend React.
- `database/`: Scripts SQL de la base de datos.
- `workers/`: Procesos en segundo plano para WhatsApp y colas.

## Despliegue en Vercel
El proyecto está configurado para desplegarse automáticamente al hacer push a la rama `main`. Asegúrate de configurar las variables de entorno en el panel de Vercel.

## Licencia
Privada - Todos los derechos reservados.
