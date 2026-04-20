# Documentación de la API Pública de WaveCRM

Bienvenido a la API pública de WaveCRM. Esta API te permite integrar tu sitio web o aplicación externa con nuestro sistema CRM.

## Autenticación

Todas las peticiones a la API pública deben incluir tu Clave API en las cabeceras HTTP:

```http
X-API-KEY: wc_tu_clave_api_aqui
```

## Endpoints

### 1. Crear Contacto
Añade un nuevo contacto a tu base de datos de WaveCRM.

**URL**: `POST /api/integraciones/contactos`
**Cuerpo (JSON)**:
```json
{
  "nombre": "Juan Pérez",
  "telefono": "+573001234567",
  "email": "juan@ejemplo.com",
  "etiquetas": ["Web", "Interesado"],
  "notas": "Registrado desde el formulario web"
}
```

### 2. Enviar Mensaje de WhatsApp
Envía un mensaje a un contacto existente.

**URL**: `POST /api/integraciones/mensajes`
**Cuerpo (JSON)**:
```json
{
  "telefono": "+573001234567",
  "contenido": "Hola Juan, gracias por contactarnos.",
  "tipo": "texto"
}
```

## Ejemplos de Implementación

### cURL
```bash
curl -X POST https://wavecrm.vercel.app/api/integraciones/contactos \
  -H "X-API-KEY: wc_tu_clave_api" \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Cliente Nuevo", "telefono": "+573000000000"}'
```

### JavaScript (Fetch)
```javascript
const response = await fetch('https://wavecrm.vercel.app/api/integraciones/contactos', {
  method: 'POST',
  headers: {
    'X-API-KEY': 'wc_tu_clave_api',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    nombre: 'Cliente Nuevo',
    telefono: '+573000000000'
  })
});
const data = await response.json();
```

### PHP
```php
<?php
$ch = curl_init('https://wavecrm.vercel.app/api/integraciones/contactos');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'X-API-KEY: wc_tu_clave_api',
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'nombre' => 'Cliente Nuevo',
    'telefono' => '+573000000000'
]));
$response = curl_exec($ch);
curl_close($ch);
?>
```
