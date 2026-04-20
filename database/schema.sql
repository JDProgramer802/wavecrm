-- Archivo SQL para Supabase (PostgreSQL)
-- WaveCRM: Sistema SaaS Multi-tenant
-- Generado por Cascade - Arquitecto Senior Fullstack

-- Extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tipos ENUM
CREATE TYPE tipo_negocio AS ENUM ('restaurante', 'tecnologia', 'cda', 'barberia', 'soporte_tecnico', 'tienda', 'colegio', 'otro');
CREATE TYPE estado_orden AS ENUM ('pendiente', 'en_proceso', 'completada', 'cancelada');
CREATE TYPE estado_cita AS ENUM ('programada', 'confirmada', 'en_espera', 'finalizada', 'cancelada');
CREATE TYPE tipo_mensaje AS ENUM ('texto', 'imagen', 'video', 'audio', 'documento', 'ubicacion', 'contacto', 'interactivo');
CREATE TYPE canal_comunicacion AS ENUM ('whatsapp', 'messenger', 'instagram', 'web');

-- Tabla: empresas
CREATE TABLE empresas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    tipo tipo_negocio NOT NULL DEFAULT 'otro',
    logo_url TEXT,
    configuracion JSONB DEFAULT '{}',
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: usuarios
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    contrasena TEXT NOT NULL,
    rol_id INTEGER NOT NULL,
    activo BOOLEAN DEFAULT true,
    ultimo_acceso TIMESTAMP WITH TIME ZONE,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(empresa_id, email)
);

-- Tabla: contactos
CREATE TABLE contactos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    nombre VARCHAR(255) NOT NULL,
    telefono VARCHAR(50),
    email VARCHAR(255),
    etiquetas TEXT[],
    notas TEXT,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(empresa_id, telefono)
);

-- Tabla: sesiones_whatsapp
CREATE TABLE sesiones_whatsapp (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    nombre_sesion VARCHAR(255) DEFAULT 'principal',
    estado VARCHAR(50) DEFAULT 'desconectado',
    datos_sesion JSONB,
    qr_code TEXT,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(empresa_id, nombre_sesion)
);

-- Tabla: conversaciones
CREATE TABLE conversaciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    contacto_id UUID NOT NULL REFERENCES contactos(id) ON DELETE CASCADE,
    ultima_interaccion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    canal canal_comunicacion DEFAULT 'whatsapp',
    sin_leer INTEGER DEFAULT 0,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(empresa_id, contacto_id, canal)
);

-- Tabla: mensajes
CREATE TABLE mensajes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    conversacion_id UUID NOT NULL REFERENCES conversaciones(id) ON DELETE CASCADE,
    remitente_id UUID, -- NULL si es del sistema o bot
    es_entrante BOOLEAN NOT NULL,
    contenido TEXT,
    tipo tipo_mensaje DEFAULT 'texto',
    metadata JSONB DEFAULT '{}',
    estado VARCHAR(50) DEFAULT 'enviado',
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tablas para CDA (Centro de Diagnóstico Automotriz)
CREATE TABLE tipos_vehiculo (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE vehiculos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    contacto_id UUID NOT NULL REFERENCES contactos(id) ON DELETE CASCADE,
    placa VARCHAR(10) NOT NULL,
    tipo_vehiculo_id INTEGER REFERENCES tipos_vehiculo(id),
    marca VARCHAR(100),
    modelo VARCHAR(100),
    vencimiento_soat DATE,
    vencimiento_tecnomecanica DATE,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(empresa_id, placa)
);

CREATE TABLE citas_cda (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    vehiculo_id UUID NOT NULL REFERENCES vehiculos(id) ON DELETE CASCADE,
    fecha_hora TIMESTAMP WITH TIME ZONE NOT NULL,
    estado estado_cita DEFAULT 'programada',
    notas TEXT,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tablas para Barbería
CREATE TABLE barberos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    usuario_id UUID REFERENCES usuarios(id),
    nombre VARCHAR(255) NOT NULL,
    especialidad TEXT,
    activo BOOLEAN DEFAULT true
);

CREATE TABLE servicios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(15,2) NOT NULL,
    duracion_minutos INTEGER DEFAULT 30,
    activo BOOLEAN DEFAULT true
);

CREATE TABLE citas_barberia (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    contacto_id UUID NOT NULL REFERENCES contactos(id) ON DELETE CASCADE,
    barbero_id UUID NOT NULL REFERENCES barberos(id) ON DELETE CASCADE,
    servicio_id UUID NOT NULL REFERENCES servicios(id) ON DELETE CASCADE,
    fecha_hora TIMESTAMP WITH TIME ZONE NOT NULL,
    estado estado_cita DEFAULT 'programada',
    notas TEXT,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: claves_api
CREATE TABLE claves_api (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    nombre VARCHAR(255) NOT NULL,
    clave_hash TEXT NOT NULL,
    prefijo VARCHAR(10) NOT NULL,
    ambitos TEXT[] DEFAULT '{read,write}',
    ultimo_uso TIMESTAMP WITH TIME ZONE,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expira_en TIMESTAMP WITH TIME ZONE
);

-- Tabla: monedas y tasas de cambio
CREATE TABLE monedas (
    codigo VARCHAR(3) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    simbolo VARCHAR(10) NOT NULL
);

CREATE TABLE tasas_cambio (
    id SERIAL PRIMARY KEY,
    moneda_origen VARCHAR(3) REFERENCES monedas(codigo),
    moneda_destino VARCHAR(3) REFERENCES monedas(codigo),
    tasa DECIMAL(20,10) NOT NULL,
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimización
CREATE INDEX idx_empresas_slug ON empresas(slug);
CREATE INDEX idx_usuarios_empresa_email ON usuarios(empresa_id, email);
CREATE INDEX idx_contactos_empresa_telefono ON contactos(empresa_id, telefono);
CREATE INDEX idx_mensajes_conversacion ON mensajes(conversacion_id);
CREATE INDEX idx_citas_cda_fecha ON citas_cda(fecha_hora);
CREATE INDEX idx_citas_barberia_fecha ON citas_barberia(fecha_hora);

-- Inserciones iniciales
INSERT INTO monedas (codigo, nombre, simbolo) VALUES 
('COP', 'Peso Colombiano', '$'),
('USD', 'Dólar Estadounidense', '$'),
('EUR', 'Euro', '€'),
('MXN', 'Peso Mexicano', '$'),
('PEN', 'Sol Peruano', 'S/'),
('CLP', 'Peso Chileno', '$'),
('ARS', 'Peso Argentino', '$');

INSERT INTO tipos_vehiculo (nombre) VALUES 
('Particular'), ('Público'), ('Motocicleta'), ('Pesado');
