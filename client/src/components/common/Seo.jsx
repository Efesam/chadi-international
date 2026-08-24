const SITE_NAME = "CHADI International";
const DEFAULT_DESCRIPTION =
  "CHADI International empowers marginalized individuals and underserved communities through health, education, livelihood and community development programs.";
const SITE_URL = import.meta.env.VITE_SITE_URL || "";
const DEFAULT_IMAGE = `${SITE_URL}/logo.png`;

/**
 * React 19 hoists <title>/<meta>/<link> rendered anywhere in the tree into
 * <head> automatically, so a plain component (no react-helmet needed) is
 * enough for per-page SEO/social tags. Renders nothing visible itself.
 */
// Organization-level structured data, unchanged across pages - lets search
// engines show CHADI as a known organization (Knowledge Panel eligibility,
// nonprofit-specific search features) rather than just an indexed page.
const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "NGO",
  name: SITE_NAME,
  alternateName: "Children and Youth Hope Alive Development Initiative",
  url: SITE_URL || undefined,
  logo: DEFAULT_IMAGE,
  description: DEFAULT_DESCRIPTION,
};

function Seo({ title, description = DEFAULT_DESCRIPTION, path = "", image = DEFAULT_IMAGE, noindex = false }) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Empowering Communities`;
  const canonical = SITE_URL ? `${SITE_URL}${path}` : undefined;

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {canonical && <link rel="canonical" href={canonical} />}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      {canonical && <meta property="og:url" content={canonical} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <script type="application/ld+json">{JSON.stringify(ORGANIZATION_JSON_LD)}</script>
    </>
  );
}

export default Seo;
