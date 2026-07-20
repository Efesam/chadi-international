import { Link } from "react-router-dom";
import { FaFacebookF, FaXTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa6";
import Logo from "./Logo";
import { useCollection } from "../../hooks/useCollection";
import { getSettings } from "../../services/api";

const socialIcons = {
  facebook: FaFacebookF,
  twitter: FaXTwitter,
  instagram: FaInstagram,
  linkedin: FaLinkedinIn,
};

const footerColumns = [
  {
    title: "Explore",
    links: [
      { label: "About", path: "/about" },
      { label: "Projects", path: "/projects" },
      { label: "Events", path: "/events" },
      { label: "Gallery", path: "/gallery" },
      { label: "News", path: "/news" },
      { label: "Stories", path: "/stories" },
      { label: "Team", path: "/team" },
    ],
  },
  {
    title: "Get Involved",
    links: [
      { label: "Donate", path: "/donate" },
      { label: "Volunteer", path: "/volunteer" },
      { label: "Get Involved", path: "/get-involved" },
      { label: "Partners", path: "/partners" },
      { label: "Careers", path: "/careers" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "FAQ", path: "/faq" },
      { label: "Resources", path: "/resources" },
      { label: "Transparency", path: "/transparency" },
      { label: "Contact", path: "/contact" },
      { label: "Privacy", path: "/privacy" },
      { label: "Terms", path: "/terms" },
    ],
  },
];

function Footer() {
  const { data: settings } = useCollection(getSettings);
  const socials = settings?.socials || {};
  const activeSocials = Object.entries(socials).filter(([, url]) => url);

  return (
    <footer className="bg-chadi-green py-14 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1.3fr_2fr]">
        <div>
          <Logo light />
          <p className="mt-5 max-w-sm leading-7 text-white/80">
            We restore dignity, create opportunity, and bring hope alive
            &mdash; through action.
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

      <div className="mx-auto mt-10 max-w-7xl border-t border-white/15 px-6 pt-6 text-sm text-white/70">
        © {new Date().getFullYear()} CHADI International. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
