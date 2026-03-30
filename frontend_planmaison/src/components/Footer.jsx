import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaChevronRight } from "react-icons/fa";

const footerLinks = [
  { name: "Le Catalogue", path: "/catalogue" },
  { name: "Plan sur mesure", path: "/sur-mesure" },
  { name: "Espace Client", path: "/login" },
  { name: "Mentions légales", path: "/mentions-legales" },
  { name: "Confidentialité", path: "/confidentialite" },
];

const socialLinks = [
  { icon: FaFacebookF, path: "#" },
  { icon: FaInstagram, path: "#" },
  { icon: FaLinkedinIn, path: "#" },
];

const FooterChic = () => {
  return (
    <footer className="relative bg-white pt-28 overflow-hidden">
      {/* Ligne décorative supérieure */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 pb-20">
          
          {/* SECTION GAUCHE : BRANDING (5 COL) */}
          <div className="lg:col-span-5 flex flex-col items-start space-y-8">
            <Link to="/" className="group flex items-center gap-4 transition-transform duration-500 hover:scale-105">
              <div className="relative">
                <div className="absolute -inset-2 bg-emerald-50 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <img src="/logo.png" alt="Logo" className="relative h-14 w-auto object-contain" />
              </div>
              <span className="text-3xl font-light tracking-tighter text-gray-900 uppercase">
                Plan<span className="font-black text-emerald-700 italic">Maison</span>
              </span>
            </Link>
            
            <p className="text-lg text-gray-400 font-light leading-relaxed max-w-sm">
              L'art de concevoir l'habitat <span className="text-gray-900 font-medium">Sénégalais</span>. 
              Des plans d'exception pour des projets de vie uniques.
            </p>

            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.path}
                  className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-50 text-gray-400 hover:bg-black hover:text-white hover:-translate-y-2 transition-all duration-500 shadow-sm"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* SECTION CENTRE : NAVIGATION (3 COL) */}
          <div className="lg:col-span-3">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 mb-10">Exploration</h4>
            <ul className="space-y-5">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="group flex items-center text-sm font-medium text-gray-500 hover:text-emerald-700 transition-colors"
                  >
                    <FaChevronRight size={8} className="mr-0 opacity-0 group-hover:mr-3 group-hover:opacity-100 transition-all duration-300 text-emerald-500" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SECTION DROITE : CONTACT/NEWS (4 COL) */}
          <div className="lg:col-span-4 flex flex-col space-y-10">
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 mb-8">Contact Privé</h4>
              <p className="text-sm font-bold text-gray-900 underline underline-offset-8 decoration-emerald-200 hover:decoration-emerald-500 transition-all cursor-pointer">
                contact@planmaison.sn
              </p>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-emerald-950 text-white relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-800 rounded-full blur-3xl group-hover:bg-emerald-600 transition-colors"></div>
              <h5 className="relative text-xs font-black uppercase tracking-widest text-emerald-400 mb-3">Newsletter</h5>
              <p className="relative text-sm font-light text-emerald-100/80 mb-6">Recevez nos dernières conceptions 3D avant tout le monde.</p>
              <div className="relative flex border-b border-emerald-800 pb-2">
                <input 
                  type="email" 
                  placeholder="Votre email..." 
                  className="bg-transparent border-none text-sm w-full focus:ring-0 placeholder:text-emerald-800"
                />
                <button className="text-emerald-400 hover:text-white transition-colors">
                   <FaChevronRight />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM SECTION */}
        <div className="py-10 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
             <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">© 2026 PlanMaison S.N.R.L</span>
             <div className="h-1 w-1 bg-gray-200 rounded-full"></div>
             <span className="text-[10px] font-medium text-gray-400 italic">By Assane Diouf</span>
          </div>

          <div className="flex items-center gap-8">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37]">
              Haute Définition PDF
            </p>
            <div className="flex gap-2">
               <div className="w-8 h-[2px] bg-emerald-600"></div>
               <div className="w-4 h-[2px] bg-[#D4AF37]"></div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterChic;