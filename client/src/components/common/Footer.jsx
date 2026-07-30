import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaFacebookF, FaXTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa6";
import Logo from "./Logo";
import { FaRss } from "react-icons/fa";
import { useCollection } from "../../hooks/useCollection";
import { getSettings, API_BASE_URL } from "../../services/api";

// The API's own origin, not the client's - /feed.xml is served by the API
// server (see server/src/routes/feed.js), a different service from the one
// serving this page in production (see docker-compose.yml).
const FEED_URL = `${API_BASE_URL.replace(/\/api\/?$/, "")}/feed.xml`;
import footerImage from "../../assets/projects/sorces-classroom-2.jpg";

const socialIcons = {
  facebook: FaFacebookF,
  twitter: FaXTwitter,
  instagram: FaInstagram,
  linkedin: FaLinkedinIn,
};

// Labels come from translation keys (nav.* is reused where a footer link
// duplicates a navbar one, footer.links.* for the rest) - built as a
// function of `t` so it re-renders in the active language instead of being
// a static, English-only array.
function getFooterColumns(t) {
  return [
    {
      title: t("footer.columns.explore"),
      links: [
        { label: t("nav.about"), path: "/about" },
        { label: t("nav.projects"), path: "/projects" },
        { label: t("footer.links.events"), path: "/events" },
        { label: t("footer.links.gallery"), path: "/gallery" },
        { label: t("nav.news"), path: "/news" },
        { label: t("footer.links.stories"), path: "/stories" },
        { label: t("footer.links.team"), path: "/team" },
      ],
    },
    {
      title: t("footer.columns.getInvolved"),
      links: [
        { label: t("nav.donate"), path: "/donate" },
        { label: t("footer.links.donorPortal"), path: "/donor-portal" },
        { label: t("footer.links.volunteer"), path: "/volunteer" },
        { label: t("nav.getInvolved"), path: "/get-involved" },
        { label: t("footer.links.partners"), path: "/partners" },
        { label: t("footer.links.careers"), path: "/careers" },
      ],
    },
    {
      title: t("footer.columns.resources"),
      links: [
        { label: t("footer.links.faq"), path: "/faq" },
        { label: t("footer.links.resources"), path: "/resources" },
        { label: t("footer.links.transparency"), path: "/transparency" },
        { label: t("footer.links.governance"), path: "/governance" },
        { label: t("nav.contact"), path: "/contact" },
        { label: t("footer.links.privacy"), path: "/privacy" },
        { label: t("footer.links.terms"), path: "/terms" },
      ],
    },
  ];
}

function Footer() {
  const { t } = useTranslation();
  const { data: settings } = useCollection(getSettings);
  const socials = settings?.socials || {};
  const activeSocials = Object.entries(socials).filter(([, url]) => url);
  const footerColumns = getFooterColumns(t);

  return (
    <footer
      className="relative overflow-hidden bg-chadi-green bg-cover bg-center py-14 text-white"
      style={{ backgroundImage: `url(${footerImage})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-chadi-green/90 via-chadi-green/95 to-chadi-green" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1.3fr_2fr]">
        <div>
          <Logo light />
          <p className="mt-5 max-w-sm leading-7 text-white/80">
            {t("footer.tagline")}
          </p>

          {activeSocials.length > 0 && (
            <div className="mt-6 flex gap-3">
              {activeSocials.map(([platform, url]) => {
                const Icon = socialIcons[platform];
                if (!Icon) return null;

                return (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`CHADI International on ${platform}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-chadi-gold hover:text-black"
                  >
                    <Icon size={14} />
                  </a>
                );
              })}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <p className="text-xs font-semibold uppercase tracking-[2px] text-chadi-lightgreen">
                {column.title}
              </p>
              <div className="mt-4 flex flex-col gap-3">
                {column.links.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="text-sm font-semibold text-white/85 transition hover:text-chadi-gold"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative mx-auto mt-10 flex max-w-7xl flex-wrap items-center justify-between gap-3 border-t border-white/15 px-6 pt-6 text-sm text-white/70">
        <span>{t("footer.copyright", { year: new Date().getFullYear() })}</span>
        <a
          href={FEED_URL}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 hover:text-white"
        >
          <FaRss size={12} /> {t("footer.rss")}
        </a>
      </div>
    </footer>
  );
}

export default Footer;
