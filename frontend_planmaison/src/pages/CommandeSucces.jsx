import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CommandeSucces = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const plan = location.state?.plan;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white px-6">
      <div className="bg-white shadow-xl rounded-2xl p-12 text-center max-w-xl">

        <h2 className="text-4xl font-bold text-green-600 mb-6">
          Paiement confirmé ✅
        </h2>

        <p className="text-gray-600 mb-6">
          Merci pour votre commande {plan?.name}.
          Votre compte a été créé automatiquement.
        </p>

        <button
          onClick={() => navigate("/compte")}
          className="bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-500 transition"
        >
          Accéder à mon espace
        </button>

      </div>
    </div>
  );
};

export default CommandeSucces;