import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const footerLinks = [
  { name: "Catalogue", path: "/catalogue" },
  { name: "Plan sur mesure", path: "/sur-mesure" },
  { name: "Mon compte", path: "/login" },
  { name: "Mentions légales", path: "/mentions-legales" },
  { name: "Confidentialité", path: "/confidentialite" },
];

const socialLinks = [
  { icon: FaFacebookF, path: "#" },
  { icon: FaInstagram, path: "#" },
  { icon: FaLinkedinIn, path: "#" },
];

const linkStyle =
  "relative transition duration-500 hover:text-green-700 group text-sm font-medium";

const activeIndicatorStyle =
  "h-0.5 bg-green-700 absolute bottom-0 left-0 w-0 group-hover:w-full rounded-full transition-all duration-500";

const FooterChic = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 text-gray-600 mt-24">
      
      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-8 py-20 grid grid-cols-1 md:grid-cols-3 gap-16 items-start text-center md:text-left">
        
        {/* LEFT */}
        <div className="flex flex-col items-center md:items-start max-w-sm mx-auto md:mx-0">
          <Link to="/" className="flex items-center space-x-3 mb-6">
            <img src="/logo.png" alt="Logo" className="h-12" />
            <span className="text-2xl font-semibold text-gray-950">
              Plan<span className="text-[#D4AF37] font-extrabold">Maison</span>
            </span>
          </Link>

          <p className="text-sm text-gray-600 font-light leading-relaxed">
            Des plans architecturaux modernes, conformes aux normes sénégalaises,
            prêts pour votre autorisation de construire.
          </p>
        </div>

        {/* CENTER */}
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-bold text-gray-950 mb-6">
            Liens utiles
          </h3>

          <ul className="space-y-4">
            {footerLinks.map((link) => (
              <li key={link.name} className="relative group">
                <Link to={link.path} className={linkStyle}>
                  {link.name}
                  <span className={activeIndicatorStyle}></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col items-center md:items-start max-w-sm mx-auto md:mx-0">
          <h3 className="text-lg font-bold text-gray-950 mb-6">
            Suivez-nous
          </h3>

          <div className="flex space-x-4 mb-6">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.path}
                className="p-3 rounded-full bg-gray-100 text-gray-600 
                hover:bg-green-50 hover:text-green-700 transition shadow hover:-translate-y-1"
              >
                <social.icon size={18} />
              </a>
            ))}
          </div>

          <p className="text-sm text-gray-600 font-light">
            Conseils, tendances et nouveautés pour réussir votre projet de construction.
          </p>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-8 py-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 gap-4">
          <p>
            © 2026 <span className="text-green-700 font-semibold">PlanMaison.sn</span> — Tous droits réservés
          </p>
          <p className="text-[#D4AF37] font-medium">
            Plans livrés en PDF haute définition
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterChic;