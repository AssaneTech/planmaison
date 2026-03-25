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
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeMobileMenu = () => setIsOpen(false);
  const toggleMobileMenu = () => setIsOpen((open) => !open);

  const linkStyle =
    "relative py-1.5 font-medium text-gray-800 transition duration-500 hover:text-indigo-600 group";
  const activeIndicatorStyle =
    "absolute bottom-0 left-0 h-0.5 rounded-full bg-indigo-600 transition-all duration-500 ease-out";

  return (
    <nav
      className={`fixed z-50 w-full transition-all duration-500 ease-out ${
        scrolled
          ? "border-b border-gray-100 bg-white/70 shadow-lg backdrop-blur-xl"
          : "bg-white/60 backdrop-blur-lg"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        <Link to="/" className="z-50 flex flex-shrink-0 items-center space-x-3.5">
          <img
            src="/logo.png"
            alt="PlanMaison Logo"
            className={`w-auto transition-all duration-500 ${scrolled ? "h-9" : "h-10"}`}
          />
          <span className="text-2xl font-semibold tracking-tight text-gray-950 sm:block">
            Plan<span className="font-extrabold text-indigo-600">Maison</span>
          </span>
        </Link>

        <div className="hidden items-center space-x-10 md:flex">
          <ul className="flex items-center space-x-10">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;

              return (
                <li key={link.name} className="group relative">
                  <Link
                    to={link.path}
                    className={`${linkStyle} ${isActive ? "text-indigo-600" : ""}`}
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

          <Link
            to="/login"
            className="rounded-full p-2 text-gray-600 transition hover:bg-indigo-50 hover:text-indigo-600"
          >
            <User size={22} />
          </Link>

          <Link
            to="/sur-mesure"
            className="flex items-center gap-2 rounded-full bg-indigo-600 px-7 py-3 font-semibold text-white shadow-md transition duration-300 hover:bg-indigo-700 hover:shadow-indigo-100"
          >
            <span>Demander un plan</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <button
          className="z-50 rounded-full bg-gray-100/70 p-2.5 text-gray-950 transition duration-300 hover:bg-gray-100 md:hidden"
          onClick={toggleMobileMenu}
          aria-label="Toggle Menu"
          type="button"
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      <div
        className={`fixed inset-0 z-40 transition-opacity duration-500 ease-in-out md:hidden ${
          isOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
        onClick={closeMobileMenu}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      </div>

      <div
        className={`fixed right-0 top-0 z-50 h-screen w-full max-w-sm transform bg-white/90 shadow-2xl backdrop-blur-2xl transition-transform duration-500 ease-out md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col space-y-9 overflow-y-auto p-10 pt-28 text-gray-900">
          <div className="absolute right-8 top-8">
            <button
              className="rounded-full bg-gray-100/70 p-3 text-gray-950 transition duration-300 hover:bg-gray-100"
              onClick={closeMobileMenu}
              type="button"
            >
              <X size={24} />
            </button>
          </div>

          <Link to="/" className="mb-12 flex items-center space-x-3.5 self-center" onClick={closeMobileMenu}>
            <img src="/logo.png" alt="PlanMaison Logo" className="h-10 w-auto" />
            <span className="text-2xl font-semibold tracking-tight text-gray-950 sm:block">
              Plan<span className="font-extrabold text-indigo-600">Maison</span>
            </span>
          </Link>

          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;

            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={closeMobileMenu}
                className={`border-b border-gray-100 pb-4 text-2xl font-bold tracking-tight transition duration-300 hover:text-indigo-600 ${
                  isActive ? "text-indigo-600" : "text-gray-950"
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          <Link
            to="/login"
            onClick={closeMobileMenu}
            className={`flex items-center gap-3 text-xl font-semibold transition duration-300 hover:text-indigo-600 ${
              location.pathname === "/login" ? "text-indigo-600" : "text-gray-900"
            }`}
          >
            <User size={22} />
            <span>Mon Compte</span>
          </Link>

          <Link
            to="/sur-mesure"
            onClick={closeMobileMenu}
            className="mt-12 flex w-full items-center justify-center gap-2.5 rounded-full bg-indigo-600 px-8 py-4.5 text-center text-lg font-semibold text-white shadow-lg transition hover:scale-[1.03] hover:bg-indigo-700"
          >
            <span>Demander mon plan d'autorisation</span>
            <ArrowRight size={18} />
          </Link>

          <p className="mt-auto pt-10 text-center text-xs text-gray-400">
            {new Date().getFullYear()} PlanMaison Senegal. Tous droits reserves.
          </p>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
