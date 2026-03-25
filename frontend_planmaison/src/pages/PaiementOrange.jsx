import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const PaiementOrange = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const plan = location.state?.plan;

  if (!plan) {
    return <div className="pt-32 text-center">Aucune commande trouvée.</div>;
  }

  const formatPrice = (price) =>
    new Intl.NumberFormat("fr-FR").format(price) + " FCFA";

  const handleSuccess = () => {
    navigate("/commande-succes", { state: { plan } });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 px-6">
      <div className="max-w-xl mx-auto bg-white shadow-xl rounded-3xl p-10 text-center">

        {/* HEADER */}
        <h2 className="text-3xl font-extrabold mb-4">
          Paiement via <span className="text-orange-500">Orange Money</span>
        </h2>

        <p className="text-gray-600 mb-6">
          Paiement rapide et sécurisé
        </p>

        {/* PLAN */}
        <div className="bg-gray-50 p-6 rounded-xl mb-6">
          <h3 className="font-semibold text-lg">{plan.name}</h3>
          <p className="text-[#D4AF37] text-2xl font-bold mt-2">
            {formatPrice(plan.price)}
          </p>
        </div>

        {/* INSTRUCTIONS */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 text-left mb-8">
          <h4 className="font-semibold text-orange-600 mb-3">
            Instructions :
          </h4>

          <ul className="text-sm text-gray-700 space-y-2">
            <li>1. Composez #144#</li>
            <li>2. Choisissez "Transfert d'argent"</li>
            <li>3. Entrez le numéro :</li>
            <li className="font-bold text-lg">77 000 00 00</li>
            <li>4. Entrez le montant exact</li>
            <li>5. Validez avec votre code</li>
          </ul>
        </div>

        {/* TRUST */}
        <div className="text-xs text-gray-500 mb-6">
          ✔ Paiement sécurisé  
          ✔ Livraison immédiate après validation  
          ✔ Assistance disponible
        </div>

        {/* BUTTON */}
        <button
          onClick={handleSuccess}
          className="w-full bg-green-700 text-white py-4 rounded-xl font-bold hover:bg-green-600 transition"
        >
          J’ai effectué le paiement
        </button>

        {/* BACK */}
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-sm text-gray-500 hover:underline"
        >
          ← Retour
        </button>

      </div>
    </div>
  );
};

export default PaiementOrange;