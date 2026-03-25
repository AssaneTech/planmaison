import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Menu, User, X } from "lucide-react";

const navLinks = [
  { name: "Accueil", path: "/" },
  { name: "Catalogue", path: "/catalogue" },
  { name: "Sur Mesure", path: "/sur-mesure" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeMobileMenu = () => setIsOpen(false);
  const toggleMobileMenu = () => setIsOpen((open) => !open);

  const linkStyle =
    "relative py-1.5 font-medium text-gray-800 transition duration-500 hover:text-green-700 group";

  const activeIndicatorStyle =
    "absolute bottom-0 left-0 h-0.5 rounded-full bg-green-700 transition-all duration-500 ease-out";

  return (
    <nav
      className={`fixed z-50 w-full transition-all duration-500 ${
        scrolled
          ? "border-b border-gray-100 bg-white/80 shadow-lg backdrop-blur-xl"
          : "bg-white/60 backdrop-blur-lg"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        
        {/* Logo */}
        <Link to="/" className="z-50 flex items-center space-x-3.5">
          <img
            src="/logo.png"
            alt="PlanMaison Logo"
            className={`transition-all duration-500 ${
              scrolled ? "h-9" : "h-10"
            }`}
          />
          <span className="text-2xl font-semibold text-gray-950">
            Plan<span className="font-extrabold text-[#D4AF37]">Maison</span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center space-x-10 md:flex">
          <ul className="flex items-center space-x-10">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;

              return (
                <li key={link.name} className="relative group">
                  <Link
                    to={link.path}
                    className={`${linkStyle} ${
                      isActive ? "text-green-700 font-semibold" : ""
                    }`}
                  >
                    {link.name}
                    <span
                      className={`${activeIndicatorStyle} ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Compte */}
          <Link
            to="/login"
            className="rounded-full p-2 text-gray-600 hover:bg-green-50 hover:text-green-700 transition"
          >
            <User size={22} />
          </Link>

          {/* CTA */}
          <Link
            to="/sur-mesure"
            className="flex items-center gap-2 rounded-full bg-green-700 px-7 py-3 font-semibold text-white shadow-md hover:bg-green-600 transition"
          >
            Demander un plan
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Mobile button */}
        <button
          className="z-50 rounded-full bg-gray-100 p-2.5 text-gray-950 md:hidden"
          onClick={toggleMobileMenu}
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden ${
          isOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
        onClick={closeMobileMenu}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed right-0 top-0 z-50 h-screen w-full max-w-sm transform bg-white shadow-2xl transition-transform md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col space-y-8 p-10 pt-28">

          <Link to="/" onClick={closeMobileMenu} className="flex items-center space-x-3">
            <img src="/logo.png" className="h-10" />
            <span className="text-2xl font-semibold">
              Plan<span className="text-[#D4AF37] font-bold">Maison</span>
            </span>
          </Link>

          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={closeMobileMenu}
              className={`text-2xl font-bold ${
                location.pathname === link.path
                  ? "text-green-700"
                  : "text-gray-900"
              }`}
            >
              {link.name}
            </Link>
          ))}

          <Link
            to="/login"
            className="flex items-center gap-3 text-lg hover:text-green-700"
          >
            <User size={22} />
            Mon compte
          </Link>

          <Link
            to="/sur-mesure"
            className="mt-10 flex justify-center gap-2 rounded-full bg-green-700 px-8 py-4 text-white font-semibold hover:bg-green-600"
          >
            Demander mon plan
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;