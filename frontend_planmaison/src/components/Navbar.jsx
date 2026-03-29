import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  ArrowRight, Menu, User, X, 
  LayoutDashboard, ShieldCheck, ShoppingBag, Users, Map, LogOut 
} from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userData, setUserData] = useState(null);
  
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Détection dynamique de l'utilisateur (Admin ou Client)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUserData(parsed);
        // Debug pour confirmer le rôle dans la console (F12)
        console.log("Navbar Status:", parsed.role);
      } catch (e) {
        console.error("Erreur de lecture session", e);
      }
    } else {
      setUserData(null);
    }
  }, [location]); // Se relance à chaque changement de page

  const isLoggedIn = !!userData;
  const isAdmin = userData?.role?.toLowerCase() === "admin";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUserData(null);
    window.location.href = "/login"; // Force le clean complet
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Liens standards
  const navLinks = [
    { name: "Accueil", path: "/" },
    { name: "Catalogue", path: "/catalogue" },
  ];

  // Lien spécifique Client
  const clientLinks = [...navLinks];
  if (isLoggedIn && !isAdmin) {
    clientLinks.push({ name: "Mes Plans", path: "/mes-plans" });
  }

  return (
    <nav className={`fixed z-50 w-full transition-all duration-500 ${
      scrolled ? "border-b border-gray-100 bg-white/95 shadow-md backdrop-blur-md" : "bg-white/70 backdrop-blur-sm"
    }`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        
        {/* --- LOGO --- */}
        <Link to="/" className="z-50 flex items-center space-x-2">
          <img src="/logo.png" alt="Logo" className="h-9" />
          <span className="text-2xl font-bold text-gray-950 tracking-tight">
            Plan<span className="text-[#D4AF37]">Maison</span>
          </span>
        </Link>

        {/* --- DESKTOP MENU --- */}
        <div className="hidden items-center space-x-8 md:flex">
          <ul className="flex items-center space-x-6">
            {(isAdmin ? navLinks : clientLinks).map((link) => (
              <li key={link.name}>
                <Link to={link.path} className={`text-sm font-semibold transition-colors hover:text-green-700 ${
                  location.pathname === link.path ? "text-green-700 underline underline-offset-8" : "text-gray-700"
                }`}>
                  {link.name}
                </Link>
              </li>
            ))}

            {/* --- BLOC ADMINISTRATION --- */}
            {isAdmin && (
              <div className="flex items-center gap-4 bg-gray-900 text-white rounded-full px-5 py-2 ml-4 shadow-lg scale-95 hover:scale-100 transition-transform">
                <ShieldCheck size={14} className="text-green-400" />
                <Link to="/admin/dashboard" className="text-[10px] font-black hover:text-green-400 transition">DASHBOARD</Link>
                <Link to="/admin/plans" className="text-[10px] font-black hover:text-green-400 transition">PLANS</Link>
                <Link to="/admin/orders" className="text-[10px] font-black hover:text-green-400 transition">ORDERS</Link>
                <Link to="/admin/users" className="text-[10px] font-black hover:text-green-400 transition">USERS</Link>
              </div>
            )}
          </ul>

          {/* ACTIONS & COMPTE */}
          <div className="flex items-center gap-4 border-l pl-6 border-gray-200">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-900">{userData.firstName}</p>
                  <p className="text-[10px] text-green-700 font-black uppercase tracking-tighter">{userData.role}</p>
                </div>
                <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-600 transition">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="p-2 text-gray-600 hover:text-green-700 transition">
                <User size={20} />
              </Link>
            )}

            <Link to="/sur-mesure" className="bg-green-700 text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-green-800 transition shadow-sm">
              Demander un plan
            </Link>
          </div>
        </div>

        {/* --- MOBILE TOGGLE --- */}
        <button className="z-50 md:hidden p-2 text-gray-950" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* --- MOBILE OVERLAY MENU --- */}
      <div className={`fixed inset-0 z-40 bg-white transform transition-transform duration-500 ease-in-out md:hidden ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        <div className="flex flex-col h-full p-10 pt-28 space-y-8">
          {(isAdmin ? navLinks : clientLinks).map((link) => (
            <Link key={link.name} to={link.path} onClick={() => setIsOpen(false)} className="text-3xl font-black text-gray-900 uppercase">
              {link.name}
            </Link>
          ))}

          {isAdmin && (
            <div className="pt-8 border-t border-gray-100 flex flex-col space-y-5">
              <p className="text-xs font-black text-green-700 uppercase tracking-[0.2em]">Administration</p>
              <Link to="/admin/dashboard" onClick={() => setIsOpen(false)} className="text-xl font-bold flex items-center gap-3 text-gray-800"><LayoutDashboard size={20}/> Dashboard</Link>
              <Link to="/admin/plans" onClick={() => setIsOpen(false)} className="text-xl font-bold flex items-center gap-3 text-gray-800"><Map size={20}/> Gestion Plans</Link>
              <Link to="/admin/orders" onClick={() => setIsOpen(false)} className="text-xl font-bold flex items-center gap-3 text-gray-800"><ShoppingBag size={20}/> Commandes</Link>
              <Link to="/admin/users" onClick={() => setIsOpen(false)} className="text-xl font-bold flex items-center gap-3 text-gray-800"><Users size={20}/> Utilisateurs</Link>
            </div>
          )}

          <div className="mt-auto">
            {isLoggedIn ? (
              <button onClick={handleLogout} className="flex items-center gap-3 text-red-600 font-black text-xl uppercase italic">
                <LogOut size={24} /> Déconnexion
              </button>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)} className="flex items-center gap-3 font-black text-xl text-gray-900 uppercase">
                <User size={24} /> Connexion
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;