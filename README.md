# Estudio Miguel Ángel Pierri & Abogados — sitio web

Sitio estático (HTML + runtime propio `dc-runtime` que carga React/Babel desde CDN en el navegador). No requiere build: se despliega tal cual.

## Estructura

- `Inicio.dc.html`, `Trayectoria.dc.html`, etc. → una página por archivo.
- `Header.dc.html`, `Footer.dc.html`, `UrgenciasBar.dc.html` → componentes compartidos que cada página carga en tiempo de ejecución (`<dc-import name="Header">`), haciendo un `fetch` relativo a `NombreComponente.dc.html`. **Importante:** no renombrar estos archivos ni las páginas — el runtime arma la URL a partir del nombre exacto.
- `support.js` / `reveal.js` → runtime, no tocar.
- `assets/`, `uploads/` → imágenes.
- `vercel.json` → reglas de *rewrite* que traducen URLs limpias (ej. `/clientes/trayectoria/`) a los archivos reales (`/Trayectoria.dc.html`), sin redirigir el navegador. `trailingSlash: true` fuerza que todas las rutas terminen en `/` (igual que el sitio WordPress original) y Vercel redirige automáticamente si alguien entra sin la barra final.
- Cada página tiene `<base href="/">` en el `<head>`. Es necesario porque el runtime resuelve `./support.js` y los componentes (`fetch` de `Header.dc.html`, etc.) de forma relativa al documento — sin el `<base>`, en rutas anidadas como `/areas/divorcio-digital-express/` esos `fetch` relativos romperían (intentarían buscar `/areas/divorcio-digital-express/support.js`, que no existe).

## Subir a GitHub

```bash
git init
git add .
git commit -m "Sitio Estudio Pierri"
git branch -M main
git remote add origin https://github.com/<tu-usuario>/<tu-repo>.git
git push -u origin main
```

## Desplegar en Vercel

1. Entrá a [vercel.com/new](https://vercel.com/new) e importá el repositorio de GitHub.
2. Framework Preset: **Other** (no hace falta build command ni output directory, es todo estático).
3. Deploy. Vercel usa automáticamente `vercel.json` para resolver las URLs limpias (`/trayectoria`, `/derecho-penal`, etc.).

## Mapa de rutas

Coincide exactamente con las URLs indexadas del sitio WordPress original (`miguelpierriabogado.com.ar`), incluida la barra final y las rutas anidadas bajo `/areas/` y `/clientes/`, para no perder el SEO acumulado.

| URL | Archivo |
|---|---|
| `/` | Inicio.dc.html |
| `/clientes/trayectoria/` | Trayectoria.dc.html |
| `/areas/` | Areas de Practica.dc.html |
| `/casos/` | Casos Resonantes.dc.html |
| `/clientes/` | Clientes.dc.html |
| `/codigo-pierri/` | Codigo Pierri.dc.html |
| `/actividades/` | Actividades.dc.html |
| `/libro/` | Libro.dc.html |
| `/politica-de-privacidad/` | Politica de Privacidad.dc.html |
| `/derecho-penal/` | Derecho Penal.dc.html |
| `/derecho-civil-y-comercial/` | Derecho Civil y Comercial.dc.html |
| `/derecho-de-familia/` | Derecho de Familia.dc.html |
| `/areas/divorcio-digital-express/` | Divorcio Digital Express.dc.html |
| `/derecho-previsional/` | Derecho Previsional.dc.html |
| `/derecho-laboral/` | Derecho Laboral.dc.html |
| `/derecho-administrativo/` | Derecho Administrativo.dc.html |
| `/areas/delitos-informaticos/` | Delitos Informaticos.dc.html |
| `/derecho-deportivo/` | Derecho Deportivo.dc.html (sección nueva, no existía en el sitio original) |
| `/corresponsales/` | Corresponsales.dc.html |
| `/pierri-online/` | Pierri Online.dc.html |
| `/noticias-destacadas/` | Noticias Destacadas.dc.html |
| `/area-lectura/` | Area Lectura.dc.html |
| `/registro-de-marcas/` | Registro de Marcas.dc.html |
| `/sistema-de-diseno` | Sistema de Diseño.dc.html (referencia interna, sin enlaces públicos, sin barra final) |

## Cambios hechos para conectar todos los enlaces

- El menú "Áreas de Práctica" del Header/Footer apuntaba a anclas (`#penal-economico`, etc.) que no existían en ninguna página. Ahora apunta a las páginas reales de área.
- Todas las rutas internas (Header, Footer, Inicio, y cross-links entre páginas de área) se alinearon con el mapa de rutas original de 21 URLs del sitio WordPress, incluyendo las rutas anidadas `/areas/divorcio-digital-express/`, `/areas/delitos-informaticos/` y `/clientes/trayectoria/` que antes se habían aplanado a rutas de un solo nivel.
- "Contacto" en el Header apunta a `/#contacto` (la sección de contacto real vive en Inicio).
- `Pierri Online`, `Corresponsales`, `Noticias Destacadas` y `Área Lectura` no tenían ningún enlace de entrada desde el sitio (páginas huérfanas); se agregaron al Footer en una columna nueva "Prensa & Recursos".
- Se quitaron 3 enlaces "leer más / cobertura completa" que apuntaban a páginas de detalle inexistentes (Casos Resonantes, Noticias Destacadas, Área Lectura); el de Casos Resonantes ahora abre WhatsApp para consultar por ese caso puntual.
- El link del Footer "Fundación Abogados Sin Fronteras" se renombró a "Actividades y Fundación" — sigue apuntando a `/actividades/` (no hay página propia de la Fundación todavía) pero ya no promete una sección que no existe.
- Se unificaron los `<title>` de las páginas de área al patrón "Derecho X" con mayúscula inicial (Derecho Civil y Comercial, Derecho de Familia, Derecho Laboral, Derecho Administrativo).

## Pendiente / a revisar con el cliente

- Los íconos de redes sociales en el Footer (`socials`) están con `href: '#'` — hay que cargar los links reales de Instagram/LinkedIn/etc. cuando el cliente los pase.
- El formulario de contacto (Inicio, Áreas de Práctica) solo hace `setState` en el navegador: no envía el email a ningún lado todavía. Hay que conectarlo a un backend/servicio (Formspree, Resend, etc.) antes de confiar en que las consultas lleguen.
