import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

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
    { name: "Projects", path: "/projects" },
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

        <Link
          to="/"
          className={`text-2xl font-black transition ${
            scrolled ? "text-chadi-green" : "text-white"
          }`}
        >
          CHADI
        </Link>

        {/* Desktop */}

        <nav className="hidden items-center gap-10 lg:flex">
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

          <Link
            to="/donate"
            className="rounded-lg bg-chadi-gold px-6 py-3 font-semibold text-black transition hover:scale-105"
          >
            Donate
          </Link>
        </nav>

        {/* Mobile Button */}

        <button
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
          mobileMenu ? "max-h-96" : "max-h-0"
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

          <Link
            to="/donate"
            onClick={() => setMobileMenu(false)}
            className="mt-6 rounded-lg bg-chadi-gold py-3 text-center font-semibold text-black"
          >
            Donate
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;