/**
 * client/src/config.js — Single source of truth for all frontend configuration.
 *
 * Every value is read from VITE_ environment variables at build time.
 * Edit client/.env to change anything — no code changes needed.
 *
 * All VITE_ vars must exist in client/.env (or .env.local) for production builds.
 * Hardcoded strings here are only emergency fallbacks for local development.
 */

const config = {
  // ── API ─────────────────────────────────────────────────────────────────────
  // Base URL for all backend API calls (proxied via Vite in dev, direct in prod)
  apiUrl: import.meta.env.VITE_API_URL || '/api',

  // ── Site ────────────────────────────────────────────────────────────────────
  // Used for canonical URLs and Open Graph tags
  siteUrl: import.meta.env.VITE_SITE_URL || 'https://shekarsdentalclinic.com',

  // ── Clinic Information ──────────────────────────────────────────────────────
  clinic: {
    name:          import.meta.env.VITE_CLINIC_NAME          || 'Shekar’s Dental Clinic',
    doctor:        import.meta.env.VITE_CLINIC_DOCTOR        || 'Dr. Rajasakar',
    qualification: import.meta.env.VITE_CLINIC_QUALIFICATION || 'BDS | Dental Surgeon',
    experience:    import.meta.env.VITE_CLINIC_EXPERIENCE    || '16+ Years',
    address:       import.meta.env.VITE_CLINIC_ADDRESS       || 'Nehru Bazar, opp. Uday Satvision, Markapur, Andhra Pradesh 523316',
    city:          import.meta.env.VITE_CLINIC_CITY          || 'Markapur, Andhra Pradesh',
    phone:         import.meta.env.VITE_CLINIC_PHONE         || '+91 7842299457',
    whatsapp:      import.meta.env.VITE_CLINIC_WHATSAPP      || '7842299457',
    email:         import.meta.env.VITE_CLINIC_EMAIL         || 'Cox_408@yahoo.co.in',
    hours: {
      weekdays: import.meta.env.VITE_CLINIC_HOURS_WEEKDAYS || 'Mon – Sat: 9:00 AM – 9:00 PM',
      sunday:   import.meta.env.VITE_CLINIC_HOURS_SUNDAY   || 'Sunday: 9:00 AM – 1:30 PM',
    },
    // Google Maps embed src URL — get this from Google Maps → Share → Embed
    mapEmbed: import.meta.env.VITE_CLINIC_MAP_EMBED ||
      'https://www.google.com/maps?q=Shekar%27s%20Dental%20Clinic%2C%20Nehru%20Bazar%2C%20opp.%20Uday%20Satvision%2C%20Markapur%2C%20Andhra%20Pradesh%20523316&output=embed',
    // Google Maps direct link for opening exact location in a new tab
    mapLink: import.meta.env.VITE_CLINIC_MAP_LINK ||
      'https://www.google.com/maps/search/?api=1&query=Shekar%27s+Dental+Clinic%2C+Nehru+Bazar%2C+opp.+Uday+Satvision%2C+Markapur%2C+Andhra+Pradesh+523316',
    // URL-encoded prefilled WhatsApp message
    whatsappMsg: import.meta.env.VITE_CLINIC_WHATSAPP_MSG ||
      'Hi%2C%20I%20would%20like%20to%20book%20an%20appointment%20at%20Shekar’s%20Dental%20Clinic.',
  },

  // ── Social Media Links ──────────────────────────────────────────────────────
  // Leave empty string to hide the icon in the footer
  social: {
    facebook:  import.meta.env.VITE_SOCIAL_FACEBOOK  || '',
    instagram: import.meta.env.VITE_SOCIAL_INSTAGRAM || '',
    twitter:   import.meta.env.VITE_SOCIAL_TWITTER   || '',
  },
};

export default config;
