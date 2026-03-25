import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CommandeSucces = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const plan = location.state?.plan;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">

      <div className="bg-white shadow-xl rounded-3xl p-10 text-center max-w-lg w-full">

        {/* ICON */}
        <div className="text-5xl mb-4">✅</div>

        {/* TITLE */}
        <h2 className="text-3xl font-bold text-green-700 mb-4">
          Paiement confirmé
        </h2>

        {/* MESSAGE */}
        <p className="text-gray-600 mb-6">
          Votre commande a été validée avec succès.
        </p>

        {/* PLAN INFO */}
        {plan && (
          <div className="bg-gray-50 rounded-xl p-5 mb-6">
            <p className="font-semibold">{plan.name}</p>
            <p className="text-[#D4AF37] font-bold text-lg mt-1">
              {new Intl.NumberFormat("fr-FR").format(plan.price)} FCFA
            </p>
          </div>
        )}

        {/* IMPORTANT MESSAGE */}
        <div className="text-sm text-gray-600 mb-6">
          📩 Vos identifiants vous ont été envoyés par email  
          📄 Votre plan sera disponible dans votre espace client
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate("/compte")}
          className="w-full bg-green-700 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition"
        >
          Accéder à mon espace
        </button>

        {/* SECONDARY */}
        <button
          onClick={() => navigate("/")}
          className="mt-3 text-sm text-gray-500 hover:underline"
        >
          Retour à l'accueil
        </button>

      </div>
    </div>
  );
};

export default CommandeSucces;