// Cookie Consent Management for GDPR Compliance

(function() {
    'use strict';

    const CONSENT_STORAGE_KEY = 'cookie_consent';
    const CONSENT_VERSION = '1.0';
    const CONSENT_DURATION_DAYS = 180;

    const consentState = {
        essential: true,
        analytics: false,
        marketing: false,
        timestamp: null,
        version: CONSENT_VERSION
    };

    let isInitialized = false;

    function getConsentFromStorage() {
        try {
            const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                const storedDate = new Date(parsed.timestamp);
                const now = new Date();
                const daysSinceConsent = (now - storedDate) / (1000 * 60 * 60 * 24);

                if (daysSinceConsent < CONSENT_DURATION_DAYS && parsed.version === CONSENT_VERSION) {
                    return parsed;
                }
            }
        } catch (e) {
            console.error('Error reading consent from storage:', e);
        }
        return null;
    }

    function saveConsentToStorage(consent) {
        try {
            const toStore = {
                ...consent,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(toStore));
        } catch (e) {
            console.error('Error saving consent to storage:', e);
        }
    }

    function loadGoogleAnalytics() {
        if (!consentState.analytics) return;

        const gaScript = document.createElement('script');
        gaScript.async = true;
        gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-V2H82YS2VS';
        gaScript.onload = function() {
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-V2H82YS2VS');
        };
        document.head.appendChild(gaScript);
    }

    function clearGoogleAnalyticsCookies() {
        const gaCookies = ['_ga', '_gid', '_gat', '_ga_' + 'G-V2H82YS2VS'];
        gaCookies.forEach(cookieName => {
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname}`;
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
        });
    }

    function createCookieBanner() {
        const banner = document.createElement('div');
        banner.className = 'cookie-consent-container';
        banner.id = 'cookieConsentBanner';
        banner.innerHTML = `
            <div class="cookie-banner" role="dialog" aria-labelledby="cookieBannerTitle" aria-describedby="cookieBannerDesc">
                <div class="cookie-banner-content">
                    <div class="cookie-banner-top">
                        <div class="cookie-icon" aria-hidden="true">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="3"/>
                                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82.33l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09a1.65 1.65 0 00-1-1.51"/>
                            </svg>
                        </div>
                        <div class="cookie-text">
                            <h2 id="cookieBannerTitle">Uso de Cookies</h2>
                            <p id="cookieBannerDesc">Utilizamos cookies esenciales para el funcionamiento del sitio y cookies de análisis para mejorar tu experiencia. Puedes personalizar tus preferencias.</p>
                            <div class="cookie-links">
                                <a href="/cookies">Política de Cookies</a>
                                <a href="/privacidad">Política de Privacidad</a>
                            </div>
                        </div>
                    </div>
                    <div class="cookie-buttons">
                        <button class="cookie-button cookie-button-outline" id="cookieRejectButton">Rechazar no esenciales</button>
                        <button class="cookie-button cookie-button-secondary" id="cookieCustomizeButton">Personalizar</button>
                        <button class="cookie-button cookie-button-primary" id="cookieAcceptAllButton">Aceptar todo</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(banner);

        document.getElementById('cookieAcceptAllButton').addEventListener('click', handleAcceptAll);
        document.getElementById('cookieCustomizeButton').addEventListener('click', openSettingsModal);
        document.getElementById('cookieRejectButton').addEventListener('click', handleRejectNonEssential);
    }

    function createSettingsModal() {
        const modal = document.createElement('div');
        modal.className = 'cookie-modal-overlay';
        modal.id = 'cookieModal';
        modal.setAttribute('aria-hidden', 'true');
        modal.innerHTML = `
            <div class="cookie-modal" role="dialog" aria-labelledby="modalTitle" aria-describedby="modalDesc">
                <div class="cookie-modal-header">
                    <h2 id="modalTitle">Configurar Cookies</h2>
                    <button class="cookie-modal-close" id="modalClose" aria-label="Cerrar">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
                <div class="cookie-modal-body" id="modalDesc">
                    <div class="cookie-category">
                        <div class="cookie-category-header">
                            <button class="cookie-category-toggle active" data-category="essential" aria-pressed="true" disabled>
                                <span class="sr-only">Cookies esenciales</span>
                            </button>
                            <h3 class="cookie-category-title">Cookies Esenciales</h3>
                        </div>
                        <p class="cookie-category-description">Necesarias para el funcionamiento básico del sitio. No se pueden desactivar.</p>
                        <p class="cookie-category-details">Ejemplo: Preferencias de consentimiento, sesiones de usuario</p>
                    </div>
                    <div class="cookie-category">
                        <div class="cookie-category-header">
                            <button class="cookie-category-toggle" data-category="analytics" aria-pressed="false">
                                <span class="sr-only">Cookies de análisis</span>
                            </button>
                            <h3 class="cookie-category-title">Cookies de Análisis</h3>
                        </div>
                        <p class="cookie-category-description">Nos ayudan a entender cómo usas el sitio para mejorarlo.</p>
                        <p class="cookie-category-details">Ejemplo: Google Analytics, estadísticas de uso</p>
                    </div>
                    <div class="cookie-category">
                        <div class="cookie-category-header">
                            <button class="cookie-category-toggle" data-category="marketing" aria-pressed="false">
                                <span class="sr-only">Cookies de marketing</span>
                            </button>
                            <h3 class="cookie-category-title">Cookies de Marketing</h3>
                        </div>
                        <p class="cookie-category-description">Se utilizan para mostrarte anuncios relevantes.</p>
                        <p class="cookie-category-details">Ejemplo: Anuncios personalizados, remarketing</p>
                    </div>
                </div>
                <div class="cookie-modal-footer">
                    <button class="cookie-button cookie-button-outline" id="modalReject">Rechazar no esenciales</button>
                    <button class="cookie-button cookie-button-primary" id="modalSave">Guardar preferencias</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const essentialToggle = modal.querySelector('[data-category="essential"]');
        const analyticsToggle = modal.querySelector('[data-category="analytics"]');
        const marketingToggle = modal.querySelector('[data-category="marketing"]');

        const storedConsent = getConsentFromStorage();
        if (storedConsent) {
            if (storedConsent.analytics) analyticsToggle.classList.add('active');
            if (storedConsent.marketing) marketingToggle.classList.add('active');
            analyticsToggle.setAttribute('aria-pressed', storedConsent.analytics);
            marketingToggle.setAttribute('aria-pressed', storedConsent.marketing);
        }

        modal.querySelectorAll('.cookie-category-toggle').forEach(toggle => {
            if (!toggle.disabled) {
                toggle.addEventListener('click', function() {
                    this.classList.toggle('active');
                    const pressed = this.getAttribute('aria-pressed') === 'true';
                    this.setAttribute('aria-pressed', !pressed);
                });
            }
        });

        document.getElementById('modalClose').addEventListener('click', closeSettingsModal);
        document.getElementById('modalReject').addEventListener('click', function() {
            const newConsent = { ...consentState, analytics: false, marketing: false };
            handleSavePreferences(newConsent);
        });
        document.getElementById('modalSave').addEventListener('click', function() {
            const newConsent = {
                ...consentState,
                analytics: analyticsToggle.classList.contains('active'),
                marketing: marketingToggle.classList.contains('active')
            };
            handleSavePreferences(newConsent);
        });
    }

    function handleAcceptAll() {
        const newConsent = { ...consentState, analytics: true, marketing: true };
        handleSavePreferences(newConsent);
    }

    function handleRejectNonEssential() {
        const newConsent = { ...consentState, analytics: false, marketing: false };
        handleSavePreferences(newConsent);
    }

    function handleSavePreferences(newConsent) {
        saveConsentToStorage(newConsent);
        Object.assign(consentState, newConsent);

        hideBanner();
        closeSettingsModal();

        if (consentState.analytics) {
            loadGoogleAnalytics();
        } else {
            clearGoogleAnalyticsCookies();
        }
    }

    function hideBanner() {
        const banner = document.getElementById('cookieConsentBanner');
        if (banner) {
            banner.style.animation = 'slideUp 0.5s ease-out reverse';
            setTimeout(() => {
                banner.remove();
            }, 500);
        }
    }

    function openSettingsModal() {
        const modal = document.getElementById('cookieModal');
        if (!modal) {
            createSettingsModal();
        }
        const modalElement = document.getElementById('cookieModal');
        modalElement.setAttribute('aria-hidden', 'false');
        modalElement.classList.add('active');
        document.body.style.overflow = 'hidden';
        document.getElementById('modalClose').focus();
    }

    function closeSettingsModal() {
        const modal = document.getElementById('cookieModal');
        if (modal) {
            modal.setAttribute('aria-hidden', 'true');
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    function handleEscapeKey(event) {
        if (event.key === 'Escape') {
            closeSettingsModal();
        }
    }

    function init() {
        if (isInitialized) return;

        const storedConsent = getConsentFromStorage();
        if (storedConsent) {
            Object.assign(consentState, storedConsent);
            if (consentState.analytics) {
                loadGoogleAnalytics();
            }
        } else {
            createCookieBanner();
        }

        createSettingsModal();
        document.addEventListener('keydown', handleEscapeKey);
        isInitialized = true;
    }

    window.openCookieSettings = openSettingsModal;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
