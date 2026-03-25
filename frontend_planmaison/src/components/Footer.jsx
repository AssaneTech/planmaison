import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

// Tes données de liens de navigation restent les mêmes
const footerLinks = [
  { name: "Catalogue", path: "/catalogue" },
  { name: "Plan sur mesure", path: "/sur-mesure" },
  { name: "Mon compte", path: "/login" }, // Mettre à jour avec le chemin réel
  { name: "Mentions légales", path: "/mentions-legales" },
  { name: "Confidentialité", path: "/confidentialite" },
];

const socialLinks = [
  { icon: FaFacebookF, path: "#" }, // Mettre à jour avec l'URL réelle
  { icon: FaInstagram, path: "#" }, // Mettre à jour avec l'URL réelle
  { icon: FaLinkedinIn, path: "#" }, // Mettre à jour avec l'URL réelle
];

// Style de base pour les liens utiles
const linkStyle = "relative transition duration-500 hover:text-indigo-600 group text-sm font-medium";

// Style pour l'indicateur de soulignement animé
const activeIndicatorStyle = "h-0.5 bg-indigo-600 absolute bottom-0 left-0 w-0 group-hover:w-full rounded-full transition-all duration-500";

const FooterChic = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 text-gray-600 mt-24">
      
      {/* SECTION PRINCIPALE DU FOOTER */}
      <div className="max-w-7xl mx-auto px-8 py-20 grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12 items-start text-center md:text-left">
        
        {/* COLONNE GAUCHE : Identité + logo (Épuré) */}
        <div className="flex flex-col items-center md:items-start max-w-sm mx-auto md:mx-0">
          <Link to="/" className="flex items-center space-x-3 mb-6 flex-shrink-0">
            <img
              src="/logo.png"
              alt="PlanMaison Logo"
              className="h-12 w-auto"
            />
            <span className="text-2xl font-semibold text-gray-950 sm:block tracking-tight">
              Plan<span className="text-indigo-600 font-extrabold">Maison</span>
            </span>
          </Link>

          <p className="text-sm leading-relaxed text-gray-600 font-light">
            Conception architecturale contemporaine et ingénierie civile rigoureuse. Des plans certifiés, conformes aux normes sénégalaises et prêts pour votre demande d'autorisation de construire.
          </p>
        </div>

        {/* COLONNE CENTRALE : Liens utiles (Minimalisme) */}
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-bold text-gray-950 mb-6 tracking-tight">
            Liens Utiles
          </h3>

          <ul className="space-y-4 text-sm font-medium">
            {footerLinks.map((link) => (
              <li key={link.name} className="relative group">
                <Link to={link.path} className={linkStyle}>
                  {link.name}
                  {/* Indicateur de soulignement animé */}
                  <span className={activeIndicatorStyle}></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* COLONNE DROITE : Suivez-nous + Inspirations (Premium Design) */}
        <div className="flex flex-col items-center md:items-start max-w-sm mx-auto md:mx-0">
          <h3 className="text-lg font-bold text-gray-950 mb-6 tracking-tight">
            Suivez-nous
          </h3>

          {/* Réseaux sociaux - Design Pill compact */}
          <div className="flex space-x-4 text-xl text-gray-500 mb-8">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.path}
                className="p-3.5 rounded-full bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 transition duration-300 shadow-md hover:shadow-indigo-100 transform hover:-translate-y-1"
              >
                <social.icon size={20} />
              </a>
            ))}
          </div>

          <p className="text-sm text-gray-600 font-light leading-relaxed">
            Restez informé des dernières tendances architecturales, des nouveautés de PlanMaison et de conseils d'experts pour la réussite de votre projet de construction au Sénégal.
          </p>
        </div>

      </div>

      {/* BAS DE PAGE - Minimaliste */}
      <div className="border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-8 py-6 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4 text-xs text-gray-400">
            <p>
                © 2026 PlanMaison.sn. Tous droits réservés. L'architecture de votre avenir, aujourd'hui.
            </p>
            <p>
                Note : Format de livraison PDF Haute Définition.
            </p>
        </div>
      </div>

    </footer>
  );
};

export default FooterChic;