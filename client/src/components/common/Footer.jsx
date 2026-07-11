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

function Footer() {
  const { data: settings } = useCollection(getSettings);
  const socials = settings?.socials || {};
  const activeSocials = Object.entries(socials).filter(([, url]) => url);

  const footerLinks = [
    { label: "Programs", path: "/programs" },
    { label: "Projects", path: "/projects" },
    { label: "News", path: "/news" },
    { label: "Events", path: "/events" },
    { label: "Gallery", path: "/gallery" },
    { label: "Partners", path: "/partners" },
    { label: "FAQ", path: "/faq" },
    { label: "Privacy", path: "/privacy" },
    { label: "Terms", path: "/terms" },
  ];

  return (
    <footer className="bg-chadi-green py-12 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-5 max-w-2xl leading-7 text-white/80">
            Empowering marginalized individuals and underserved communities
            through innovation, compassion and sustainable development.
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

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {footerLinks.map((link) => (
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

      <div className="mx-auto mt-10 max-w-7xl border-t border-white/15 px-6 pt-6 text-sm text-white/70">
        © {new Date().getFullYear()} CHADI International. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
