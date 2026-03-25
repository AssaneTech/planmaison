import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const PaiementWave = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const plan = location.state?.plan;

  if (!plan) {
    return <div className="pt-32 text-center">Aucune commande trouvée.</div>;
  }

  const handleSuccess = () => {
    navigate("/commande-succes", { state: { plan } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-28 px-6">
      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-2xl p-10 text-center">

        <h2 className="text-3xl font-bold text-blue-600 mb-6">
          Paiement via Wave
        </h2>

        <p className="text-gray-600 mb-4">
          Vous allez payer pour :
        </p>

        <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
        <p className="text-2xl font-bold text-indigo-600 mb-8">
          {new Intl.NumberFormat("fr-FR").format(plan.price)} FCFA
        </p>

        <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl mb-8">
          Simulation de paiement Wave
        </div>

        <button
          onClick={handleSuccess}
          className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-500 transition"
        >
          Confirmer le paiement
        </button>

      </div>
    </div>
  );
};

export default PaiementWave;