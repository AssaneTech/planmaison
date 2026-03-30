import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Menu, User, X, LayoutDashboard, ShieldCheck, 
  ShoppingBag, Users, Map, LogOut, FileText, PlusCircle 
} from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userData, setUserData] = useState(null);
  
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Détection dynamique de l'utilisateur
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUserData(parsed);
      } catch (e) {
        console.error("Erreur de lecture session", e);
      }
    } else {
      setUserData(null);
    }
  }, [location]);

  const isLoggedIn = !!userData;
  const isAdmin = userData?.role?.toLowerCase() === "admin";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUserData(null);
    setIsOpen(false);
    window.location.href = "/login";
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Accueil", path: "/" },
    { name: "Catalogue", path: "/catalogue" },
  ];

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
            Plan<span className="text-green-700">Maison</span>
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

            {/* --- BLOC ADMINISTRATION (Le cerveau de la gestion) --- */}
            {isAdmin && (
              <div className="flex items-center gap-4 bg-gray-950 text-white rounded-full px-5 py-2.5 ml-4 shadow-xl scale-95 hover:scale-100 transition-all border border-gray-800">
                <ShieldCheck size={14} className="text-green-400 animate-pulse" />
                <Link to="/admin/dashboard" className="text-[9px] font-black hover:text-green-400 transition tracking-widest">DASHBOARD</Link>
                <Link to="/admin/plans" className="text-[9px] font-black hover:text-green-400 transition tracking-widest">PLANS</Link>
                
                {/* 🎯 NOUVEAU LIEN : GESTION DES DEMANDES SUR MESURE */}
                <Link to="/admin/requests" className="text-[9px] font-black hover:text-green-400 transition tracking-widest flex items-center gap-1">
                  REQUESTS
                  <span className="h-1.5 w-1.5 bg-green-500 rounded-full"></span>
                </Link>
                
                <Link to="/admin/orders" className="text-[9px] font-black hover:text-green-400 transition tracking-widest">ORDERS</Link>
                <Link to="/admin/users" className="text-[9px] font-black hover:text-green-400 transition tracking-widest">USERS</Link>
              </div>
            )}
          </ul>

          {/* ACTIONS & COMPTE */}
          <div className="flex items-center gap-4 border-l pl-6 border-gray-200">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-900 leading-none mb-1">{userData.firstName}</p>
                  <p className="text-[9px] text-green-700 font-black uppercase tracking-tighter bg-green-50 px-2 rounded-sm italic">
                    {userData.role}
                  </p>
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

            <Link to="/sur-mesure" className="bg-green-700 text-white px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-gray-950 transition-all shadow-lg shadow-green-100 flex items-center gap-2">
              <PlusCircle size={14} /> Demander un plan
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
        <div className="flex flex-col h-full p-10 pt-28 space-y-8 overflow-y-auto">
          {(isAdmin ? navLinks : clientLinks).map((link) => (
            <Link key={link.name} to={link.path} onClick={() => setIsOpen(false)} className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter">
              {link.name}
            </Link>
          ))}

          {isAdmin && (
            <div className="pt-8 border-t border-gray-100 flex flex-col space-y-5">
              <p className="text-[10px] font-black text-green-700 uppercase tracking-[0.3em] mb-2">Espace Administration</p>
              <Link to="/admin/dashboard" onClick={() => setIsOpen(false)} className="text-xl font-bold flex items-center gap-4 text-gray-800"><LayoutDashboard size={22}/> Dashboard</Link>
              <Link to="/admin/plans" onClick={() => setIsOpen(false)} className="text-xl font-bold flex items-center gap-4 text-gray-800"><Map size={22}/> Gestion Plans</Link>
              
              {/* LIEN MOBILE POUR LES REQUÊTES */}
              <Link to="/admin/custom-requests" onClick={() => setIsOpen(false)} className="text-xl font-bold flex items-center gap-4 text-gray-800">
                <FileText size={22} className="text-green-600"/> Demandes Sur-Mesure
              </Link>

              <Link to="/admin/orders" onClick={() => setIsOpen(false)} className="text-xl font-bold flex items-center gap-4 text-gray-800"><ShoppingBag size={22}/> Commandes</Link>
              <Link to="/admin/users" onClick={() => setIsOpen(false)} className="text-xl font-bold flex items-center gap-4 text-gray-800"><Users size={22}/> Utilisateurs</Link>
            </div>
          )}

          <div className="mt-auto pt-10">
            <Link to="/sur-mesure" onClick={() => setIsOpen(false)} className="w-full bg-green-700 text-white py-5 rounded-2xl font-black text-center block uppercase tracking-widest mb-6">
              Demander un plan personnalisé
            </Link>
            {isLoggedIn ? (
              <button onClick={handleLogout} className="flex items-center gap-3 text-red-600 font-black text-xl uppercase italic">
                <LogOut size={24} /> Déconnexion
              </button>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)} className="flex items-center gap-3 font-black text-xl text-gray-900 uppercase">
                <User size={24} /> Connexion au compte
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;