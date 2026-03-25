import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const FinaliserCommande = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
      alert("Choisissez une méthode de paiement");
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
    <div className="bg-gray-50 min-h-screen pt-28 px-6">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold">
            Finaliser votre <span className="text-green-700">commande</span>
          </h2>
          <p className="text-gray-600 mt-3">
            Paiement rapide et sécurisé
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">

          {/* PLAN */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4">
              Résumé du plan
            </h3>

            <img
              src={plan.image}
              alt={plan.name}
              className="w-full h-52 object-cover rounded-xl mb-4"
            />

            <h4 className="font-semibold">{plan.name}</h4>
            <p className="text-gray-500 text-sm">Surface : {plan.surface}</p>

            <div className="mt-4 text-xl font-bold text-[#D4AF37]">
              {formatPrice(plan.price)}
            </div>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow p-8 space-y-5"
          >
            <h3 className="text-lg font-semibold">
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
              placeholder="Email"
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

            {/* PAIEMENT */}
            <div>
              <h4 className="text-sm font-semibold mb-3">
                Méthode de paiement
              </h4>

              <div className="space-y-3">

                <label className={`paiement-option ${formData.paiement === "wave" && "selected"}`}>
                  <input type="radio" name="paiement" value="wave" onChange={handleChange}/>
                  <span>📱 Wave (recommandé)</span>
                </label>

                <label className={`paiement-option ${formData.paiement === "orange-money" && "selected"}`}>
                  <input type="radio" name="paiement" value="orange-money" onChange={handleChange}/>
                  <span>🟠 Orange Money</span>
                </label>

                <label className={`paiement-option ${formData.paiement === "carte" && "selected"}`}>
                  <input type="radio" name="paiement" value="carte" onChange={handleChange}/>
                  <span>💳 Carte bancaire</span>
                </label>

              </div>
            </div>

            <p className="text-xs text-gray-500">
              Un compte sera créé automatiquement après paiement.
            </p>

            {/* CTA */}
            <button
              type="submit"
              className="w-full bg-green-700 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition"
            >
              Payer {formatPrice(plan.price)}
            </button>
          </form>
        </div>
      </div>

      {/* STYLES */}
      <style jsx>{`
        .input-style {
          @apply w-full border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl 
          focus:outline-none focus:ring-2 focus:ring-green-200 transition;
        }

        .paiement-option {
          @apply flex items-center gap-3 border rounded-xl p-3 cursor-pointer transition;
        }

        .paiement-option:hover {
          @apply border-green-500;
        }

        .selected {
          @apply border-green-600 bg-green-50;
        }
      `}</style>
    </div>
  );
};

export default FinaliserCommande;