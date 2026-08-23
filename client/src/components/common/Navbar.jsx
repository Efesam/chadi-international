import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaBars, FaTimes, FaSearch } from "react-icons/fa";
import Logo from "./Logo";
import DonateModal from "./DonateModal";
import LanguageSwitcher from "./LanguageSwitcher";
import DarkModeToggle from "./DarkModeToggle";

function Navbar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [donateOpen, setDonateOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: t("nav.home"), path: "/" },
    { name: t("nav.about"), path: "/about" },
    { name: t("nav.projects"), path: "/projects" },
    { name: t("nav.news"), path: "/news" },
    { name: t("nav.blog"), path: "/blog" },
    { name: t("nav.getInvolved"), path: "/get-involved" },
    { name: t("nav.contact"), path: "/contact" },
  ];

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? "bg-white shadow-xl py-4 dark:bg-gray-900"
          : "bg-transparent py-6"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">

        {/* Logo */}

        <Logo light={!scrolled} />

        {/* Desktop */}

        <nav className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `font-medium transition ${
                  isActive
                    ? scrolled
                      ? "text-chadi-gold-dark dark:text-chadi-gold"
                      : "text-chadi-gold"
                    : scrolled
                    ? "text-gray-700 dark:text-gray-200 hover:text-chadi-green dark:hover:text-chadi-gold"
                    : "text-white hover:text-chadi-gold"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}

          <button
            type="button"
            aria-label="Search the site"
            onClick={() => navigate("/search")}
            className={`text-lg transition ${
              scrolled
                ? "text-gray-700 dark:text-gray-200 hover:text-chadi-green dark:hover:text-chadi-gold"
                : "text-white hover:text-chadi-gold"
            }`}
          >
            <FaSearch />
          </button>

          <LanguageSwitcher dark={!scrolled} />
          <DarkModeToggle dark={!scrolled} />

          <button
            type="button"
            onClick={() => setDonateOpen(true)}
            className="rounded-lg bg-chadi-gold px-6 py-3 font-semibold text-black transition hover:scale-105"
          >
            {t("nav.donate")}
          </button>
        </nav>

        {/* Mobile Button */}

        {/* -mr-2 keeps the icon optically aligned with the container edge
            while the padding grows the tap target to 44px - this is the
            primary navigation control on mobile and was only 24x24. */}
        <button
          type="button"
          aria-label="Toggle navigation menu"
          onClick={() => setMobileMenu(!mobileMenu)}
          className={`-mr-2 flex h-11 w-11 items-center justify-center text-2xl lg:hidden ${
            scrolled ? "text-chadi-green dark:text-chadi-lightgreen" : "text-white"
          }`}
        >
          {mobileMenu ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}

      <div
        className={`overflow-hidden bg-white transition-all duration-500 dark:bg-gray-900 lg:hidden ${
          mobileMenu ? "max-h-[34rem]" : "max-h-0"
        }`}
      >
        <div className="flex flex-col p-6">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenu(false)}
              className={({ isActive }) =>
                `border-b py-4 dark:border-gray-700 ${
                  isActive ? "font-bold text-chadi-green dark:text-chadi-lightgreen" : "text-gray-700 dark:text-gray-200"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}

          <button
            type="button"
            onClick={() => {
              setMobileMenu(false);
              navigate("/search");
            }}
            className="flex items-center gap-2 border-b py-4 text-gray-700 dark:text-gray-200"
          >
            <FaSearch size={14} /> Search
          </button>

          <div className="flex items-center justify-between border-b py-4 dark:border-gray-700">
            <LanguageSwitcher />
            <DarkModeToggle />
          </div>

          <button
            type="button"
            onClick={() => {
              setMobileMenu(false);
              setDonateOpen(true);
            }}
            className="mt-6 rounded-lg bg-chadi-gold py-3 text-center font-semibold text-black"
          >
            {t("nav.donate")}
          </button>
        </div>
      </div>

      <DonateModal open={donateOpen} onClose={() => setDonateOpen(false)} />
    </header>
  );
}

export default Navbar;
