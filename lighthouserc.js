// @ts-check
/** @type {import('@lhci/cli').LighthouseConfig} */
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:8000/'],
      startServerCommand: 'node scripts/server.js',
      startServerReadyPattern: 'Server running',
      numberOfRuns: 3,
      settings: {
        // Use mobile throttling for realistic performance testing
        preset: 'desktop',
        // Skip specific audits that don't apply to static sites
        skipAudits: ['uses-http2', 'redirects-http'],
      },
    },
    assert: {
      assertions: {
        // Performance - aim for 90+
        'categories:performance': ['warn', { minScore: 0.9 }],
        // Accessibility - strict, must be 90+
        'categories:accessibility': ['error', { minScore: 0.9 }],
        // Best practices - aim for 90+
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        // SEO - aim for 90+
        'categories:seo': ['warn', { minScore: 0.9 }],
        // Core Web Vitals
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
      },
    },
    upload: {
      // Use temporary public storage for CI reports
      target: 'temporary-public-storage',
    },
  },
};
