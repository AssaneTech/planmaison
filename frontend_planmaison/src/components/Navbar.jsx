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

  // 🔥 USER SESSION
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      setUserData(storedUser ? JSON.parse(storedUser) : null);
    } catch (e) {
      console.error("Erreur session:", e);
      setUserData(null);
    }
  }, [location]);

  const isLoggedIn = !!userData;
  const isAdmin = userData?.role?.toLowerCase() === "admin";

  // 🔥 LOGOUT (PROPRE)
  const handleLogout = () => {
    localStorage.clear();
    setUserData(null);
    setIsOpen(false);
    navigate("/login");
  };

  // 🔥 SCROLL EFFECT
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
      scrolled ? "border-b bg-white/95 shadow-md backdrop-blur-md" : "bg-white/70 backdrop-blur-sm"
    }`}>
      
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center space-x-2">
          <img src="/logo.png" alt="Logo" className="h-9" />
          <span className="text-2xl font-bold">
            Plan<span className="text-green-700">Maison</span>
          </span>
        </Link>

        {/* DESKTOP */}
        <div className="hidden md:flex items-center space-x-8">

          {/* NAV LINKS */}
          <ul className="flex space-x-6">
            {(isAdmin ? navLinks : clientLinks).map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className={`text-sm font-semibold hover:text-green-700 ${
                    location.pathname === link.path
                      ? "text-green-700 underline"
                      : "text-gray-700"
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* ADMIN PANEL */}
          {isAdmin && (
            <div className="flex items-center gap-4 bg-black text-white px-4 py-2 rounded-full">
              <ShieldCheck size={14} className="text-green-400" />
              <Link to="/admin/dashboard">Dashboard</Link>
              <Link to="/admin/plans">Plans</Link>
              <Link to="/admin/requests">Requests</Link> {/* ✅ harmonisé */}
              <Link to="/admin/orders">Orders</Link>
              <Link to="/admin/users">Users</Link>
            </div>
          )}

          {/* USER / ACTIONS */}
          <div className="flex items-center gap-4 border-l pl-6">

            {isLoggedIn ? (
              <>
                <div>
                  <p className="text-xs font-bold">{userData.firstName}</p>
                  <p className="text-[10px] text-green-700 uppercase">
                    {userData.role}
                  </p>
                </div>

                <button onClick={handleLogout} className="text-red-500">
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <Link to="/login">
                <User size={20} />
              </Link>
            )}

            <Link
              to="/sur-mesure"
              className="bg-green-700 text-white px-4 py-2 rounded-full text-xs"
            >
              <PlusCircle size={14} /> Plan sur mesure
            </Link>
          </div>
        </div>

        {/* MOBILE BUTTON */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="fixed inset-0 bg-white z-40 p-10 pt-28 flex flex-col space-y-6 md:hidden">

          {(isAdmin ? navLinks : clientLinks).map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="text-2xl font-bold"
            >
              {link.name}
            </Link>
          ))}

          {isAdmin && (
            <>
              <Link to="/admin/dashboard">Dashboard</Link>
              <Link to="/admin/plans">Plans</Link>
              <Link to="/admin/requests">Requests</Link>
              <Link to="/admin/orders">Orders</Link>
              <Link to="/admin/users">Users</Link>
            </>
          )}

          <div className="mt-auto">
            {isLoggedIn ? (
              <button onClick={handleLogout} className="text-red-600">
                Déconnexion
              </button>
            ) : (
              <Link to="/login">Connexion</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;