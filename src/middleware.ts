import { defineMiddleware } from 'astro:middleware';

const SUPPORTED_LOCALES = ['th', 'en'];
const DEFAULT_LOCALE = 'th'; // Thai is root

export const onRequest = defineMiddleware(async (context, next) => {
    const { url, request } = context;
    const pathname = url.pathname;

    // Skip if already on a locale path, or if it's an asset/api request
    if (
        pathname.startsWith('/en/') ||
        pathname.startsWith('/_') ||
        pathname.startsWith('/api/') ||
        pathname.includes('.') // skip files like .css, .js, .png
    ) {
        return next();
    }

    // Only redirect on the root path or Thai content paths (first visit)
    // Check if there's a locale preference cookie
    const localeCookie = context.cookies.get('preferred_locale')?.value;

    if (localeCookie) {
        // User has a preference, respect it
        if (localeCookie === 'en' && !pathname.startsWith('/en/')) {
            // Redirect to English version
            return context.redirect(`/en${pathname === '/' ? '/' : pathname}`);
        }
        return next();
    }

    // Detect browser language from Accept-Language header
    const acceptLanguage = request.headers.get('accept-language') || '';
    const browserLang = detectPreferredLanguage(acceptLanguage);

    // Set cookie for future visits
    context.cookies.set('preferred_locale', browserLang, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365, // 1 year
        httpOnly: false,
        sameSite: 'lax',
    });

    // Redirect to English if browser prefers English
    if (browserLang === 'en' && !pathname.startsWith('/en/')) {
        return context.redirect(`/en${pathname === '/' ? '/' : pathname}`);
    }

    return next();
});

function detectPreferredLanguage(acceptLanguage: string): string {
    // Parse Accept-Language header: "en-US,en;q=0.9,th;q=0.8"
    const languages = acceptLanguage
        .split(',')
        .map((lang) => {
            const [code, q = 'q=1'] = lang.trim().split(';');
            const quality = parseFloat(q.replace('q=', '')) || 1;
            // Get primary language code (e.g., 'en' from 'en-US')
            const primaryCode = code.split('-')[0].toLowerCase();
            return { code: primaryCode, quality };
        })
        .sort((a, b) => b.quality - a.quality);

    // Find first supported language
    for (const { code } of languages) {
        if (SUPPORTED_LOCALES.includes(code)) {
            return code;
        }
    }

    return DEFAULT_LOCALE;
}
