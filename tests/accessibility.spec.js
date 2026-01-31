// @ts-check
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

/**
 * Tests de accesibilidad WCAG 2.1 AA usando axe-core
 * 
 * Ejecutar: npx playwright test tests/accessibility.spec.js
 * 
 * Niveles de conformidad testeados:
 * - WCAG 2.0 Level A
 * - WCAG 2.0 Level AA
 * - WCAG 2.1 Level AA
 */

test.describe('Accesibilidad WCAG 2.1 AA', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Esperar a que la página cargue completamente
    await page.waitForLoadState('networkidle');
  });

  test('página principal sin violaciones críticas', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    // Mostrar violaciones para debugging si las hay
    if (accessibilityScanResults.violations.length > 0) {
      console.log('Violaciones encontradas:', JSON.stringify(accessibilityScanResults.violations, null, 2));
    }

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('navegación principal accesible', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('nav')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('sección hero accesible', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('section:first-of-type')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('sección servicios accesible', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('#servicios')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('sección nosotros/beneficios accesible', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('#nosotros')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('sección testimonios accesible', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('#testimonios')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('sección contacto accesible', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('#contacto')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('footer accesible', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('footer')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('contraste de colores adecuado', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .options({ rules: { 'color-contrast': { enabled: true } } })
      .analyze();

    const contrastViolations = accessibilityScanResults.violations.filter(
      v => v.id === 'color-contrast'
    );
    
    expect(contrastViolations).toEqual([]);
  });

  test('elementos interactivos tienen foco visible', async ({ page }) => {
    // Verificar que los elementos interactivos son focuseables
    const interactiveElements = await page.locator('a, button, input, [tabindex]').all();
    
    for (const element of interactiveElements.slice(0, 10)) { // Testear primeros 10
      const isVisible = await element.isVisible();
      if (isVisible) {
        await element.focus();
        // Verificar que el elemento puede recibir foco
        const isFocused = await element.evaluate(el => document.activeElement === el);
        // Solo verificar elementos visibles que deberían ser focuseables
        const tabIndex = await element.getAttribute('tabindex');
        if (tabIndex !== '-1') {
          expect(isFocused).toBe(true);
        }
      }
    }
  });

  test('imágenes y SVGs decorativos están ocultos para lectores de pantalla', async ({ page }) => {
    // Verificar que los SVGs en las cards tienen aria-hidden
    const decorativeSvgs = await page.locator('.group svg[aria-hidden="true"]').count();
    expect(decorativeSvgs).toBeGreaterThan(0);
    
    // Verificar el botón hamburguesa tiene aria-label
    const mobileMenuBtn = page.locator('#mobile-menu-btn');
    const ariaLabel = await mobileMenuBtn.getAttribute('aria-label');
    expect(ariaLabel).toBeTruthy();
  });

  test('menú móvil tiene atributos ARIA correctos', async ({ page }) => {
    const mobileMenuBtn = page.locator('#mobile-menu-btn');
    
    // Verificar aria-expanded inicial
    const initialExpanded = await mobileMenuBtn.getAttribute('aria-expanded');
    expect(initialExpanded).toBe('false');
    
    // Verificar aria-controls
    const ariaControls = await mobileMenuBtn.getAttribute('aria-controls');
    expect(ariaControls).toBe('mobile-menu');
  });
});
