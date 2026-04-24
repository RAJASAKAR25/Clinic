import { Helmet } from 'react-helmet-async';
import { CLINIC } from '../utils/constants.js';
import config from '../config.js';

/**
 * SEOMeta — dynamic <head> tag manager.
 *
 * @param {string} title         Page-level <title> (appended with clinic name)
 * @param {string} description   Meta description
 * @param {string} [canonical]   Canonical URL path (e.g. "/about")
 */
const SEOMeta = ({ title, description, canonical }) => {
  const fullTitle = title ? `${title} | ${CLINIC.name}` : CLINIC.name;
  // siteUrl is configured via VITE_SITE_URL in client/.env
  const canonUrl  = canonical ? `${config.siteUrl}${canonical}` : config.siteUrl;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonUrl} />
      <meta property="og:title"       content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url"         content={canonUrl} />
    </Helmet>
  );
};

export default SEOMeta;
