import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const plans = {
  1: {
    id: 1,
    name: "Villa Moderne 3 Chambres",
    price: 450000,
    description:
      "Plan moderne adapté aux terrains en rue, optimisé pour l’espace et conforme aux normes.",
    dimensions: "10m x 15m",
    surface: "150 m²",
    type: "Rue",
    images: ["/plan-1.png", "/plan-1-rdc.png", "/plan-1-etage.png"],
  },
  2: {
    id: 2,
    name: "Duplex Standing 4 Chambres",
    price: 650000,
    description:
      "Maison spacieuse conçue pour les terrains en angle.",
    dimensions: "15m x 20m",
    surface: "300 m²",
    type: "Angle",
    images: ["/plan-2.png", "/plan-2-rdc.png", "/plan-2-etage.png"],
  },
  3: {
    id: 3,
    name: "Studio Compact",
    price: 250000,
    description:
      "Studio compact idéal pour petites parcelles.",
    dimensions: "8m x 12m",
    surface: "96 m²",
    type: "Rue",
    images: ["/plan-3.png", "/plan-3-rdc.png", "/plan-3-etage.png"],
  },
};

const VoirDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const plan = plans[id];

  const [selectedImage, setSelectedImage] = useState(plan?.images[0] || null);

  const formatPrice = (price) =>
    new Intl.NumberFormat("fr-FR").format(price) + " FCFA";

  if (!plan) {
    return (
      <div className="text-center py-20 bg-gray-50 min-h-screen pt-28">
        <h1 className="text-2xl font-bold mb-4">Plan introuvable</h1>
        <button
          onClick={() => navigate(-1)}
          className="text-green-700 hover:underline"
        >
          Retour
        </button>
      </div>
    );
  }

  const handleCommander = () => {
    navigate("/finaliser-commande", { state: { plan } });
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-28 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-gray-500">
          <span onClick={() => navigate('/')} className="cursor-pointer hover:text-green-700">Accueil</span> / 
          <span onClick={() => navigate('/catalogue')} className="cursor-pointer hover:text-green-700"> Catalogue</span> / 
          <span className="text-gray-900 font-medium"> {plan.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-12">

          {/* IMAGES */}
          <div>
            <img
              src={selectedImage}
              className="w-full h-[350px] object-cover rounded-2xl shadow mb-4"
            />

            <div className="grid grid-cols-4 gap-3">
              {plan.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setSelectedImage(img)}
                  className={`cursor-pointer rounded-lg border-2 ${
                    selectedImage === img
                      ? "border-green-700"
                      : "border-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* INFOS */}
          <div className="bg-white p-8 rounded-2xl shadow flex flex-col">

            <h1 className="text-3xl font-bold mb-4">{plan.name}</h1>

            <p className="text-[#D4AF37] text-2xl font-bold mb-6">
              {formatPrice(plan.price)}
            </p>

            <p className="text-gray-600 mb-6">{plan.description}</p>

            {/* CARACTERISTIQUES */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-xl">
                📏 {plan.dimensions}
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                📐 {plan.surface}
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                🏗️ {plan.type}
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                📄 PDF HD
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handleCommander}
              className="bg-green-700 text-white py-4 rounded-xl font-bold hover:bg-green-600 transition"
            >
              Commander ce plan
            </button>

            <p className="text-xs text-gray-400 text-center mt-3">
              Paiement via Wave / Orange Money / Carte
            </p>

          </div>
        </div>

        {/* PACK */}
        <div className="mt-16 bg-white p-8 rounded-2xl shadow">
          <h2 className="text-xl font-bold mb-4">
            Contenu du pack
          </h2>

          <ul className="grid md:grid-cols-2 gap-3 text-gray-600">
            <li>✔ Plans RDC et étages</li>
            <li>✔ Façades</li>
            <li>✔ Coupes</li>
            <li>✔ Plan de masse</li>
            <li>✔ Assainissement</li>
            <li>✔ Note technique</li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default VoirDetails;