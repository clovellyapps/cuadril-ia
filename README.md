# CuadrilIA - Sitio Web

![Tests](https://github.com/clovellyapps/cuadril-ia/actions/workflows/test.yml/badge.svg)

Sitio web de marketing para CuadrilIA, empresa de formación y consultoría en Inteligencia Artificial.

## Tecnologías

- **HTML5** - Estructura semántica
- **Tailwind CSS** (via CDN) - Estilos y diseño responsive
- **JavaScript Vanilla** - Interactividad
- **GitHub Pages** - Hosting

## Estructura del Proyecto

```
cuadril-ia/
├── index.html          # Página principal (single-page)
├── og-image.svg        # Imagen para redes sociales
├── llm.txt             # Información para LLMs/AI crawlers
├── robots.txt          # Directivas para crawlers
├── sitemap.xml         # Mapa del sitio para SEO
├── .nojekyll           # Desactiva procesamiento Jekyll
├── package.json        # Dependencias de desarrollo
├── playwright.config.js # Configuración de tests
├── tests/
│   └── responsive.spec.js  # Tests de responsive
└── README.md           # Este archivo
```

## Probar en Local

### Opción 1: Python (más simple)

```bash
# Python 3
python3 -m http.server 8000

# Abrir en navegador
open http://localhost:8000
```

### Opción 2: Node.js con live-reload

```bash
# Usando npx (no requiere instalación)
npx serve

# O con live-reload
npx live-server
```

### Opción 3: VS Code Live Server

1. Instalar la extensión "Live Server" en VS Code
2. Click derecho en `index.html`
3. Seleccionar "Open with Live Server"

### Opción 4: PHP (si está disponible)

```bash
php -S localhost:8000
```

## Despliegue en GitHub Pages

### Configuración Inicial

1. Crear repositorio en GitHub (público o privado)
2. Subir el código:

```bash
git init
git add .
git commit -m "Initial commit: CuadrilIA website"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/cuadril-ia.git
git push -u origin main
```

3. Configurar GitHub Pages:
   - Ir a **Settings** > **Pages**
   - Source: "Deploy from a branch"
   - Branch: `main`, folder: `/ (root)`
   - Guardar

4. Esperar ~1-2 minutos para el despliegue

5. Acceder a: `https://TU_USUARIO.github.io/cuadril-ia/`

### Dominio Personalizado

Para usar un dominio propio (ej: `cuadrilia.es`):

1. Crear archivo `CNAME` en la raíz:

```bash
echo "cuadrilia.es" > CNAME
```

2. Configurar DNS en tu proveedor:
   - Registro A: apuntar a IPs de GitHub Pages:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
   - O registro CNAME: `TU_USUARIO.github.io`

3. En GitHub Pages settings, añadir el dominio personalizado

4. Activar "Enforce HTTPS"

## Ejecutar Tests

### Instalación de dependencias

```bash
npm install
```

### Instalar navegadores para Playwright

```bash
npx playwright install
```

### Ejecutar tests de responsive

```bash
# Ejecutar todos los tests
npm test

# Ejecutar con interfaz visual
npm run test:ui

# Ejecutar un test específico
npx playwright test tests/responsive.spec.js
```

### Ejecutar tests de accesibilidad

```bash
# Ejecutar tests de accesibilidad con axe-core
npx playwright test tests/accessibility.spec.js

# Ejecutar con output detallado
npx playwright test tests/accessibility.spec.js --reporter=list
```

Los tests de accesibilidad validan:
- Conformidad WCAG 2.0 Level A
- Conformidad WCAG 2.0 Level AA
- Conformidad WCAG 2.1 Level AA
- Contraste de colores
- Atributos ARIA
- Elementos focuseables

### Ver reporte de tests

```bash
npx playwright show-report
```

## Personalización

### Cambiar colores

Editar la configuración de Tailwind en `index.html`:

```javascript
tailwind.config = {
    theme: {
        extend: {
            colors: {
                dark: { 900: '#0d1117', ... },
                accent: { 500: '#7c3aed', ... }
            }
        }
    }
}
```

### Añadir Google Forms

Reemplazar el placeholder en la sección de contacto con tu iframe:

```html
<iframe 
    src="https://docs.google.com/forms/d/e/TU_FORM_ID/viewform?embedded=true" 
    width="100%" 
    height="600" 
    frameborder="0" 
    marginheight="0" 
    marginwidth="0">
    Cargando…
</iframe>
```

### Actualizar meta tags

Para SEO y redes sociales, actualizar las URLs en `index.html`:

```html
<link rel="canonical" href="https://TU_DOMINIO/">
<meta property="og:url" content="https://TU_DOMINIO/">
<meta property="og:image" content="https://TU_DOMINIO/og-image.svg">
```

## SEO y GEO

El sitio incluye:

- Meta tags SEO (title, description, keywords)
- Open Graph para Facebook/LinkedIn
- Twitter Cards
- Meta tags de geolocalización
- JSON-LD structured data
- Sitemap XML
- robots.txt
- llm.txt para AI crawlers

## Licencia

© 2026 CuadrilIA. Todos los derechos reservados.
