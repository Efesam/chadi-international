import { Link } from "react-router-dom";
import Logo from "./Logo";

function Footer() {
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
