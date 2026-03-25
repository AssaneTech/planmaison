import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const PaiementCarte = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const plan = location.state?.plan;

  const [cardData, setCardData] = useState({
    numero: "",
    nom: "",
    expiration: "",
    cvv: "",
  });

  if (!plan) {
    return <div className="pt-32 text-center">Aucune commande trouvée.</div>;
  }

  const formatPrice = (price) =>
    new Intl.NumberFormat("fr-FR").format(price) + " FCFA";

  const handleChange = (e) => {
    setCardData({ ...cardData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulation paiement
    navigate("/commande-succes", { state: { plan } });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 px-6">
      <div className="max-w-xl mx-auto bg-white shadow-xl rounded-3xl p-10">

        {/* HEADER */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold">
            Paiement par <span className="text-green-700">carte</span>
          </h2>
          <p className="text-gray-500 mt-2">
            Paiement sécurisé SSL
          </p>
        </div>

        {/* PLAN */}
        <div className="bg-gray-50 p-5 rounded-xl mb-6 text-center">
          <h3 className="font-semibold">{plan.name}</h3>
          <p className="text-[#D4AF37] text-xl font-bold mt-2">
            {formatPrice(plan.price)}
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            type="text"
            name="numero"
            placeholder="Numéro de carte"
            required
            onChange={handleChange}
            className="input-style"
          />

          <input
            type="text"
            name="nom"
            placeholder="Nom sur la carte"
            required
            onChange={handleChange}
            className="input-style"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="expiration"
              placeholder="MM/AA"
              required
              onChange={handleChange}
              className="input-style"
            />

            <input
              type="text"
              name="cvv"
              placeholder="CVV"
              required
              onChange={handleChange}
              className="input-style"
            />
          </div>

          {/* TRUST */}
          <div className="text-xs text-gray-500 text-center">
            🔐 Paiement sécurisé  
            • Vos données sont protégées  
            • Aucun stockage de carte
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full bg-green-700 text-white py-4 rounded-xl font-bold hover:bg-green-600 transition"
          >
            Payer {formatPrice(plan.price)}
          </button>
        </form>

        {/* BACK */}
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-sm text-gray-500 hover:underline w-full text-center"
        >
          ← Retour
        </button>

      </div>

      {/* STYLE */}
      <style jsx>{`
        .input-style {
          @apply w-full border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl 
          focus:outline-none focus:ring-2 focus:ring-green-200 transition;
        }
      `}</style>
    </div>
  );
};

export default PaiementCarte;