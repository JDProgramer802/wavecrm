import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const path = url.pathname;

  // Si es la raíz, permitir
  if (path === '/') {
    return NextResponse.next();
  }

  // Extraer el slug (primer segmento de la ruta)
  const segmentos = path.split('/').filter(Boolean);
  const slug = segmentos[0];

  // Si no hay slug, redirigir a inicio
  if (!slug) {
    return NextResponse.rewrite(new URL('/', req.url));
  }

  // Aquí se podría validar el slug contra la base de datos si fuera necesario
  // pero para rendimiento serverless, lo manejaremos en las rutas de la API
  
  return NextResponse.next();
}
