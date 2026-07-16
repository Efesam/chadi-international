import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import Logo from "./Logo";
import DonateModal from "./DonateModal";

function Navbar() {
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
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Programs", path: "/programs" },
    { name: "Projects", path: "/projects" },
    { name: "News", path: "/news" },
    { name: "Get Involved", path: "/get-involved" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? "bg-white shadow-xl py-4"
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
                    ? "text-chadi-gold"
                    : scrolled
                    ? "text-gray-700 hover:text-chadi-green"
                    : "text-white hover:text-chadi-gold"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}

          <button
            type="button"
            onClick={() => setDonateOpen(true)}
            className="rounded-lg bg-chadi-gold px-6 py-3 font-semibold text-black transition hover:scale-105"
          >
            Donate
          </button>
        </nav>

        {/* Mobile Button */}

        <button
          type="button"
          aria-label="Toggle navigation menu"
          onClick={() => setMobileMenu(!mobileMenu)}
          className={`text-2xl lg:hidden ${
            scrolled ? "text-chadi-green" : "text-white"
          }`}
        >
          {mobileMenu ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}

      <div
        className={`overflow-hidden bg-white transition-all duration-500 lg:hidden ${
          mobileMenu ? "max-h-[34rem]" : "max-h-0"
        }`}
      >
        <div className="flex flex-col p-6">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenu(false)}
              className="border-b py-4 text-gray-700"
            >
              {item.name}
            </NavLink>
          ))}

          <button
            type="button"
            onClick={() => {
              setMobileMenu(false);
              setDonateOpen(true);
            }}
            className="mt-6 rounded-lg bg-chadi-gold py-3 text-center font-semibold text-black"
          >
            Donate
          </button>
        </div>
      </div>

      <DonateModal open={donateOpen} onClose={() => setDonateOpen(false)} />
    </header>
  );
}

export default Navbar;
