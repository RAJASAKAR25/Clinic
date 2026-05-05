import { Helmet } from 'react-helmet-async';
import { CLINIC } from '../utils/constants.js';
import config from '../config.js';

/**
 * SEOMeta — dynamic <head> tag manager.
 *
 * @param {string}  title        Page-level <title> (appended with clinic name)
 * @param {string}  description  Meta description (150–160 chars ideal)
 * @param {string}  [canonical]  Canonical URL path (e.g. "/about")
 * @param {string}  [keywords]   Comma-separated keyword list for this page
 * @param {string}  [ogImage]    Absolute URL of OG image (defaults to Clinic_Logo.png)
 * @param {string}  [robots]     robots directive override (default: "index, follow")
 */
const SEOMeta = ({ title, description, canonical, keywords, ogImage, robots = 'index, follow' }) => {
  const fullTitle  = title ? `${title} | ${CLINIC.name}` : CLINIC.name;
  const canonUrl   = canonical ? `${config.siteUrl}${canonical}` : config.siteUrl;
  const imageUrl   = ogImage || `${config.siteUrl}/assets/Clinic_Logo.png`;

  return (
    <Helmet>
      {/* ── Core ──────────────────────────────────────────────────────── */}
      <title>{fullTitle}</title>
      <meta name="description"        content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots"             content={robots} />
      <link rel="canonical"           href={canonUrl} />

      {/* ── Open Graph ────────────────────────────────────────────────── */}
      <meta property="og:type"        content="website" />
      <meta property="og:url"         content={canonUrl} />
      <meta property="og:title"       content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image"       content={imageUrl} />
      <meta property="og:image:alt"   content={`${CLINIC.name} — ${CLINIC.city}`} />
      <meta property="og:site_name"   content={CLINIC.name} />

      {/* ── Twitter Card ──────────────────────────────────────────────── */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:title"       content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image"       content={imageUrl} />
      <meta name="twitter:image:alt"   content={`${CLINIC.name} — ${CLINIC.city}`} />
    </Helmet>
  );
};

export default SEOMeta;
