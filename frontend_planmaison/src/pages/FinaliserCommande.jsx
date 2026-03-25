import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const FinaliserCommande = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Récupération du plan envoyé depuis VoirDetails
  const plan = location.state?.plan || {
    id: 1,
    name: "Villa Moderne 3 Chambres",
    image: "/plan-1.png",
    surface: "150 m²",
    price: 450000,
  };

  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    paiement: "",
  });

  const formatPrice = (price) =>
    new Intl.NumberFormat("fr-FR").format(price) + " FCFA";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.paiement) {
      alert("Veuillez choisir une méthode de paiement.");
      return;
    }

    const stateData = {
      plan,
      client: formData,
    };

    if (formData.paiement === "wave") {
      navigate("/paiement-wave", { state: stateData });
    }

    if (formData.paiement === "orange-money") {
      navigate("/paiement-orange", { state: stateData });
    }

    if (formData.paiement === "carte") {
      navigate("/paiement-carte", { state: stateData });
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen pt-28 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Titre */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-800">
            Finaliser votre <span className="text-indigo-600">Commande</span>
          </h2>
          <p className="text-gray-600 mt-3">
            Complétez vos informations pour recevoir votre plan personnalisé.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">

          {/* Résumé du plan */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">
              Résumé du plan
            </h3>

            <img
              src={plan.image}
              alt={plan.name}
              className="w-full h-56 object-cover rounded-xl mb-6"
            />

            <h4 className="text-lg font-semibold mb-2">{plan.name}</h4>
            <p className="text-gray-500 mb-2">Surface : {plan.surface}</p>

            <div className="mt-6 text-2xl font-bold text-indigo-600">
              {formatPrice(plan.price)}
            </div>
          </div>

          {/* Formulaire */}
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-gray-200 rounded-2xl shadow-md p-8 space-y-6"
          >
            <h3 className="text-xl font-semibold text-gray-800">
              Informations client
            </h3>

            <input
              type="text"
              name="nom"
              placeholder="Nom complet"
              required
              onChange={handleChange}
              className="input-style"
            />

            <input
              type="email"
              name="email"
              placeholder="Adresse email"
              required
              onChange={handleChange}
              className="input-style"
            />

            <input
              type="tel"
              name="telephone"
              placeholder="Téléphone"
              required
              onChange={handleChange}
              className="input-style"
            />

            {/* Paiement */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Méthode de paiement
              </h4>

              <div className="space-y-3">
                <label className="flex items-center gap-3 border rounded-xl p-3 cursor-pointer hover:border-indigo-500 transition">
                  <input
                    type="radio"
                    name="paiement"
                    value="wave"
                    onChange={handleChange}
                  />
                  Wave
                </label>

                <label className="flex items-center gap-3 border rounded-xl p-3 cursor-pointer hover:border-indigo-500 transition">
                  <input
                    type="radio"
                    name="paiement"
                    value="orange-money"
                    onChange={handleChange}
                  />
                  Orange Money
                </label>

                <label className="flex items-center gap-3 border rounded-xl p-3 cursor-pointer hover:border-indigo-500 transition">
                  <input
                    type="radio"
                    name="paiement"
                    value="carte"
                    onChange={handleChange}
                  />
                  Carte bancaire
                </label>
              </div>
            </div>

            <p className="text-xs text-gray-500">
              Après paiement validé, votre compte sera créé automatiquement
              et vos identifiants vous seront envoyés par email.
            </p>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-semibold px-6 py-3 rounded-2xl hover:bg-indigo-500 transition shadow-md hover:shadow-lg"
            >
              Payer {formatPrice(plan.price)}
            </button>
          </form>
        </div>
      </div>

      {/* Style input */}
      <style jsx>{`
        .input-style {
          @apply w-full border border-gray-300 bg-gray-50 px-4 py-3 rounded-xl 
          focus:outline-none focus:ring-2 focus:ring-indigo-500 transition;
        }
      `}</style>
    </div>
  );
};

export default FinaliserCommande;