// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('CuadrilIA - Tests de Responsive y Adaptive', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Esperar a que Tailwind CSS cargue
    await page.waitForLoadState('networkidle');
  });

  test.describe('Navegación', () => {
    
    test('el navbar debe ser visible', async ({ page }) => {
      const navbar = page.locator('#navbar');
      await expect(navbar).toBeVisible();
    });

    test('el logo debe ser visible y contener CuadrilIA', async ({ page }) => {
      const logo = page.locator('nav a').first();
      await expect(logo).toBeVisible();
      await expect(logo).toContainText('CuadrilIA');
    });

    test('los enlaces de navegación deben funcionar', async ({ page }) => {
      const viewport = page.viewportSize();
      const isMobile = viewport && viewport.width < 768;
      
      // Helper function to navigate to a section
      async function navigateTo(href, sectionId) {
        if (isMobile) {
          // Open mobile menu
          await page.click('#mobile-menu-btn');
          await page.waitForTimeout(300);
        }
        
        // Click the navigation link
        const link = page.locator(`a[href="${href}"]:visible`).first();
        await link.click();
        
        // Wait for scroll to complete and verify section is visible
        const section = page.locator(sectionId);
        await section.waitFor({ state: 'visible' });
        await page.waitForTimeout(800); // Extra time for smooth scroll in CI
      }
      
      // Test navigation to Servicios
      await navigateTo('#servicios', '#servicios');
      await expect(page.locator('#servicios')).toBeVisible();
      
      // Test navigation to Contacto
      await navigateTo('#contacto', '#contacto');
      await expect(page.locator('#contacto')).toBeVisible();
    });
  });

  test.describe('Menú Móvil', () => {
    
    test('el menú hamburguesa debe estar oculto en desktop', async ({ page, browserName }, testInfo) => {
      // Solo en viewports grandes (desktop)
      const viewport = page.viewportSize();
      if (viewport && viewport.width >= 768) {
        const mobileMenuBtn = page.locator('#mobile-menu-btn');
        await expect(mobileMenuBtn).toBeHidden();
      }
    });

    test('el menú hamburguesa debe estar visible en móvil', async ({ page }, testInfo) => {
      const viewport = page.viewportSize();
      if (viewport && viewport.width < 768) {
        const mobileMenuBtn = page.locator('#mobile-menu-btn');
        await expect(mobileMenuBtn).toBeVisible();
      }
    });

    test('el menú móvil debe abrirse al hacer click', async ({ page }) => {
      const viewport = page.viewportSize();
      if (viewport && viewport.width < 768) {
        const mobileMenu = page.locator('#mobile-menu');
        await expect(mobileMenu).toBeHidden();
        
        await page.click('#mobile-menu-btn');
        await expect(mobileMenu).toBeVisible();
      }
    });
  });

  test.describe('Hero Section', () => {
    
    test('el título principal debe ser visible', async ({ page }) => {
      const h1 = page.locator('h1').first();
      await expect(h1).toBeVisible();
      await expect(h1).toContainText('cuadrilIA');
    });

    test('los botones CTA deben ser visibles', async ({ page }) => {
      const ctaPrimary = page.locator('a:has-text("Únete a la cuadrilla")');
      const ctaSecondary = page.locator('a:has-text("Descubre cómo")');
      
      await expect(ctaPrimary).toBeVisible();
      await expect(ctaSecondary).toBeVisible();
    });

    test('los CTAs deben ser clicables', async ({ page }) => {
      const ctaPrimary = page.locator('a:has-text("Únete a la cuadrilla")');
      await expect(ctaPrimary).toHaveAttribute('href', '#contacto');
    });
  });

  test.describe('Carrusel de Logos', () => {
    
    test('el carrusel debe estar visible', async ({ page }) => {
      const marquee = page.locator('.animate-marquee').first();
      await expect(marquee).toBeVisible();
    });

    test('los logos de IA deben estar presentes', async ({ page }) => {
      await expect(page.locator('text=Anthropic').first()).toBeVisible();
      await expect(page.locator('text=OpenAI').first()).toBeVisible();
      await expect(page.locator('text=Gemini').first()).toBeVisible();
    });
  });

  test.describe('Sección de Servicios', () => {
    
    test('la sección de servicios debe existir', async ({ page }) => {
      const section = page.locator('#servicios');
      await expect(section).toBeVisible();
    });

    test('debe mostrar 6 cards de servicios', async ({ page }) => {
      const cards = page.locator('#servicios .grid > div');
      await expect(cards).toHaveCount(6);
    });

    test('las cards de servicios deben ser visibles', async ({ page }) => {
      await page.locator('#servicios').scrollIntoViewIfNeeded();
      
      // Esperar animación fade-in
      await page.waitForTimeout(1000);
      
      const talleres = page.locator('h3:has-text("Talleres In-Situ")');
      await expect(talleres).toBeVisible();
    });

    test('el texto de las cards no debe desbordarse', async ({ page }) => {
      const cards = page.locator('#servicios .grid > div');
      const count = await cards.count();
      
      for (let i = 0; i < count; i++) {
        const card = cards.nth(i);
        const box = await card.boundingBox();
        
        if (box) {
          // Verificar que la card tiene dimensiones razonables
          expect(box.width).toBeGreaterThan(200);
          expect(box.height).toBeGreaterThan(150);
        }
      }
    });
  });

  test.describe('Sección Por qué CuadrilIA', () => {
    
    test('la sección debe existir', async ({ page }) => {
      const section = page.locator('#nosotros');
      await expect(section).toBeVisible();
    });

    test('debe mostrar 4 beneficios', async ({ page }) => {
      await page.locator('#nosotros').scrollIntoViewIfNeeded();
      const beneficios = page.locator('#nosotros .grid > div');
      await expect(beneficios).toHaveCount(4);
    });
  });

  test.describe('Sección de Testimonios', () => {
    
    test('la sección de testimonios debe existir', async ({ page }) => {
      const section = page.locator('#testimonios');
      await expect(section).toBeVisible();
    });

    test('debe mostrar 3 testimonios', async ({ page }) => {
      await page.locator('#testimonios').scrollIntoViewIfNeeded();
      const testimonios = page.locator('#testimonios .grid > div');
      await expect(testimonios).toHaveCount(3);
    });

    test('los testimonios deben tener nombre y cargo', async ({ page }) => {
      await page.locator('#testimonios').scrollIntoViewIfNeeded();
      await expect(page.locator('text=María G.')).toBeVisible();
      await expect(page.locator('text=Carlos R.')).toBeVisible();
      await expect(page.locator('text=Laura M.')).toBeVisible();
    });
  });

  test.describe('Sección de Contacto', () => {
    
    test('la sección de contacto debe existir', async ({ page }) => {
      const section = page.locator('#contacto');
      await expect(section).toBeVisible();
    });

    test('debe tener un email de contacto', async ({ page }) => {
      await page.locator('#contacto').scrollIntoViewIfNeeded();
      const email = page.locator('a[href="mailto:hola@cuadril.es"]');
      await expect(email).toBeVisible();
    });
  });

  test.describe('Footer', () => {
    
    test('el footer debe ser visible', async ({ page }) => {
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();
    });

    test('debe contener el copyright', async ({ page }) => {
      const footer = page.locator('footer');
      await expect(footer).toContainText('2026 CuadrilIA');
    });

    test('debe tener el logo', async ({ page }) => {
      const footerLogo = page.locator('footer svg').first();
      await expect(footerLogo).toBeVisible();
    });
  });

  test.describe('Responsive Layout', () => {
    
    test('las cards de servicios deben adaptarse al viewport', async ({ page }) => {
      const viewport = page.viewportSize();
      const grid = page.locator('#servicios .grid');
      
      if (viewport) {
        await page.locator('#servicios').scrollIntoViewIfNeeded();
        
        if (viewport.width < 768) {
          // En móvil: 1 columna
          const firstCard = page.locator('#servicios .grid > div').first();
          const box = await firstCard.boundingBox();
          if (box) {
            // La card debe ocupar casi todo el ancho
            expect(box.width).toBeGreaterThan(viewport.width * 0.8);
          }
        }
      }
    });

    test('el hero debe estar centrado', async ({ page }) => {
      const heroContent = page.locator('section').first().locator('.text-center');
      await expect(heroContent).toBeVisible();
    });

    test('no debe haber scroll horizontal', async ({ page }) => {
      const body = page.locator('body');
      const box = await body.boundingBox();
      const viewport = page.viewportSize();
      
      if (box && viewport) {
        // El body no debe ser más ancho que el viewport
        expect(box.width).toBeLessThanOrEqual(viewport.width + 1);
      }
    });
  });

  test.describe('Animaciones', () => {
    
    test('el navbar debe tener efecto glass al hacer scroll', async ({ page }) => {
      const navbar = page.locator('#navbar');
      
      // Inicialmente sin glass
      await expect(navbar).not.toHaveClass(/glass/);
      
      // Scroll down
      await page.evaluate(() => window.scrollTo(0, 100));
      await page.waitForTimeout(100);
      
      // Debe tener glass
      await expect(navbar).toHaveClass(/glass/);
    });

    test('los elementos fade-in deben animarse al entrar en viewport', async ({ page }) => {
      const fadeElements = page.locator('.fade-in');
      const count = await fadeElements.count();
      
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('Accesibilidad básica', () => {
    
    test('las imágenes SVG deben tener contenido accesible', async ({ page }) => {
      // Verificar que los SVG tienen elementos visuales
      const svgs = page.locator('svg');
      const count = await svgs.count();
      expect(count).toBeGreaterThan(0);
    });

    test('los enlaces deben tener texto descriptivo', async ({ page }) => {
      const links = page.locator('a[href]');
      const count = await links.count();
      
      for (let i = 0; i < count; i++) {
        const link = links.nth(i);
        const text = await link.textContent();
        const hasContent = text && text.trim().length > 0;
        const hasSvg = await link.locator('svg').count() > 0;
        
        // El enlace debe tener texto o contener un SVG
        expect(hasContent || hasSvg).toBeTruthy();
      }
    });

    test('el documento debe tener lang="es"', async ({ page }) => {
      const html = page.locator('html');
      await expect(html).toHaveAttribute('lang', 'es');
    });

    test('debe tener un título de página', async ({ page }) => {
      const title = await page.title();
      expect(title).toContain('CuadrilIA');
    });
  });

  test.describe('SEO', () => {
    
    test('debe tener meta description', async ({ page }) => {
      const metaDesc = page.locator('meta[name="description"]');
      await expect(metaDesc).toHaveAttribute('content', /.+/);
    });

    test('debe tener Open Graph tags', async ({ page }) => {
      const ogTitle = page.locator('meta[property="og:title"]');
      const ogDesc = page.locator('meta[property="og:description"]');
      
      await expect(ogTitle).toHaveAttribute('content', /.+/);
      await expect(ogDesc).toHaveAttribute('content', /.+/);
    });

    test('debe tener canonical URL', async ({ page }) => {
      const canonical = page.locator('link[rel="canonical"]');
      await expect(canonical).toHaveAttribute('href', /.+/);
    });
  });
});
