import React, { useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    motDePasse: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Note pour l'Ingénieur Software (MERN Stack) :
    // C'est ici que tu appelleras ton API Node.js/Express pour authentifier l'utilisateur.
    console.log("Tentative de connexion avec :", formData);
    
    // Une fois connecté, tu redirigeras vers son espace client
    // navigate("/mon-espace-client");
  };

  return (
    // Conteneur principal : Flexbox pour centrer parfaitement le cadre
    <div className="bg-gray-50 min-h-screen text-gray-900 flex items-center justify-center p-4">
      
      {/* CADRE UNIQUE ET CENTRÉ (Maximum simplicité) */}
      <div className="bg-white p-10 md:p-12 rounded-3xl shadow-xl border border-gray-100 w-full max-w-md flex flex-col items-center">
        
        {/* Titre simple et impactant */}
        <h1 className="text-3xl font-extrabold text-gray-950 tracking-tight mb-10 text-center">
            Connexion <span className="text-indigo-600">PlanMaison</span>
        </h1>
        
        {/* Le Formulaire Compact */}
        <form onSubmit={handleSubmit} className="space-y-6 w-full">
          
          {/* Champ E-mail */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 tracking-wide pl-1">Adresse e-mail</label>
            <input 
              type="email" 
              name="email" 
              placeholder="votre.email@exemple.com" 
              value={formData.email}
              onChange={handleChange} 
              required 
              className="w-full pl-6 pr-6 py-3.5 rounded-full bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition duration-300 text-lg font-semibold" 
            />
          </div>

          {/* Champ Mot de Passe */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-baseline">
              <label className="text-sm font-semibold text-gray-700 tracking-wide pl-1">Mot de passe</label>
              <Link to="/mot-de-passe-oublie" className="text-sm text-indigo-600 hover:underline">Oublié ?</Link>
            </div>
            <input 
              type="password" 
              name="motDePasse" 
              placeholder="votre-mot-de-passe-sécurisé" 
              value={formData.motDePasse}
              onChange={handleChange} 
              required 
              className="w-full pl-6 pr-6 py-3.5 rounded-full bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition duration-300 text-lg font-semibold" 
            />
          </div>

          {/* Bouton de Connexion (Design Pill) */}
          <div className="pt-6 border-t border-gray-100 mt-10 w-full">
            <button
                type="submit"
                className="w-full bg-indigo-600 text-white font-bold px-8 py-4 rounded-full shadow-lg hover:bg-indigo-700 hover:shadow-indigo-100 transition duration-300 transform hover:scale-[1.02] text-xl flex items-center justify-center space-x-3"
            >
                <span>Se connecter</span>
            </button>
          </div>

        </form>

        {/* Section pour l'inscription */}
        <div className="mt-10 text-center border-t border-gray-100 pt-7 w-full">
            <p className="text-sm text-gray-600">
                Pas de compte ? <Link to="/inscription" className="text-indigo-600 hover:underline font-medium">S'inscrire</Link>
            </p>
        </div>

      </div>

    </div>
  );
};

export default Login;
