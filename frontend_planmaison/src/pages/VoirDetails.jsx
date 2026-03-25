import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Tes données restent les mêmes
const plans = {
  1: {
    id: 1,
    name: "Villa Moderne 3 Chambres",
    price: 450000,
    description:
      "Plan moderne adapté aux terrains en rue, optimisé pour l’espace et conforme aux normes d'autorisation de construire.",
    dimensions: "10m x 15m",
    surface: "150 m²", // Ajout d'une info pertinente pour un ingénieur civil
    type: "Rue",
    images: [
      "/plan-1.png", // Rendu 3D principal
      "/plan-1-rdc.png", // Plan simplifié RDC
      "/plan-1-etage.png", // Plan simplifié Étage
    ],
  },
  2: {
    id: 2,
    name: "Duplex Standing 4 Chambres",
    price: 650000,
    description:
      "Maison spacieuse conçue pour les terrains en angle, avec une circulation optimisée et conforme aux normes.",
    dimensions: "15m x 20m",
    surface: "300 m²",
    type: "Angle",
    images: [
      "/plan-2.png",
      "/plan-2-rdc.png",
      "/plan-2-etage.png",
    ],
  },
  3: {
    id: 3,
    name: "Studio Compact",
    price: 250000,
    description:
      "Studio compact et fonctionnel, idéal pour les petites parcelles et investissements locatifs.",
    dimensions: "8m x 12m",
    surface: "96 m²",
    type: "Rue",
    images: [
      "/plan-3.png",
      "/plan-3-rdc.png",
      "/plan-3-etage.png",
    ],
  },
};

const VoirDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const plan = plans[id];

  // État pour l'image principale affichée. On l'initialise avec la première image du plan.
  const [selectedImage, setSelectedImage] = useState(plan?.images[0] || null);

  const formatPrice = (price) =>
    new Intl.NumberFormat("fr-FR").format(price) + " FCFA";

  if (!plan) {
    return (
      <div className="text-center py-20 text-gray-600 bg-gray-50 min-h-screen pt-28">
        <h1 className="text-2xl font-bold mb-4">Oups !</h1>
        <p>Ce plan de maison est introuvable.</p>
        <button onClick={() => navigate(-1)} className="mt-6 text-indigo-600 hover:underline">
          Retourner au catalogue
        </button>
      </div>
    );
  }

  const handleCommander = () => {
    // Note pour l'ingénieur Software : C'est ici que tu initieras plus tard l'achat côté serveur avec l'API CinetPay.
    // Pour l'instant, on redirige vers le formulaire de commande.
    navigate("/finaliser-commande", { state: { plan } });
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-28 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Fil d'Ariane (Breadcrumb) - Toujours bon pour le SEO */}
        <nav className="mb-8 text-sm text-gray-500">
          <span className="hover:text-indigo-600 cursor-pointer" onClick={() => navigate('/')}>Accueil</span> / <span className="hover:text-indigo-600 cursor-pointer" onClick={() => navigate('/catalogue')}>Catalogue</span> / <span className="font-medium text-gray-800">{plan.name}</span>
        </nav>

        {/* Grille principale : 2 colonnes sur desktop, 1 colonne sur mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">

          {/* COLONNE GAUCHE : GALERIE D'IMAGES */}
          <div className="space-y-4">
            {/* 1. Image principale en grand */}
            <div className="aspect-w-16 aspect-h-12 w-full overflow-hidden rounded-3xl shadow-lg border border-gray-100 bg-white">
              <img
                src={selectedImage}
                alt={`${plan.name} - Vue principale`}
                className="w-full h-full object-cover object-center transition-opacity duration-300"
              />
            </div>

            {/* 2. Liste des miniatures en bas */}
            <div className="grid grid-cols-4 gap-4">
              {plan.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(img)} // Change l'image principale au clic
                  className={`aspect-w-1 aspect-h-1 overflow-hidden rounded-xl border-2 transition duration-200 
                  ${selectedImage === img 
                    ? 'border-indigo-600 ring-2 ring-indigo-200' // Miniature sélectionnée
                    : 'border-gray-200 hover:border-gray-300' // Miniature non sélectionnée
                  }`}
                >
                  <img
                    src={img}
                    alt={`${plan.name} - Miniature ${index + 1}`}
                    className="w-full h-full object-cover object-center"
                  />
                </button>
              ))}
            </div>
          </div>


          {/* COLONNE DROITE : INFOS, PRIX, CARACTÉRISTIQUES, BOUTON */}
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100 flex flex-col">
            
            {/* En-tête : Nom et Prix */}
            <div className="mb-8 border-b border-gray-100 pb-6">
              <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-4">
                {plan.name}
              </h1>
              <p className="text-3xl font-bold text-indigo-600">
                {formatPrice(plan.price)}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Note : Ce pack contient les plans complets requis pour la demande d'autorisation de construire.
              </p>
            </div>

            {/* Description */}
            <div className="mb-10 text-gray-700 leading-relaxed space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Description du projet</h2>
              <p>{plan.description}</p>
            </div>

            {/* Caractéristiques techniques - Disposition en grille compacte */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-5 mb-12 flex-grow">
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 flex items-center space-x-3">
                <span className="text-2xl">📏</span>
                <div>
                  <dt className="text-xs text-gray-500 uppercase font-medium tracking-wide">Dimensions</dt>
                  <dd className="text-lg font-semibold text-gray-900">{plan.dimensions}</dd>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 flex items-center space-x-3">
                <span className="text-2xl">📐</span>
                <div>
                  <dt className="text-xs text-gray-500 uppercase font-medium tracking-wide">Surface habitable</dt>
                  <dd className="text-lg font-semibold text-gray-900">{plan.surface}</dd>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 flex items-center space-x-3">
                <span className="text-2xl">⛰️</span>
                <div>
                  <dt className="text-xs text-gray-500 uppercase font-medium tracking-wide">Type de terrain</dt>
                  <dd className="text-lg font-semibold text-gray-900">{plan.type}</dd>
                </div>
              </div>
              
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 flex items-center space-x-3">
                <span className="text-2xl">📄</span>
                <div>
                  <dt className="text-xs text-gray-500 uppercase font-medium tracking-wide">Format de livraison</dt>
                  <dd className="text-lg font-semibold text-gray-900">PDF Haute Définition</dd>
                </div>
              </div>
            </div>

            {/* Bouton Commander - Placé en bas, prend toute la largeur */}
            <div className="mt-auto">
              <button
                onClick={handleCommander}
                className="w-full bg-indigo-600 text-white font-bold px-8 py-5 rounded-2xl shadow-lg 
                hover:bg-indigo-700 hover:shadow-indigo-200 transition duration-300 transform hover:-translate-y-1 text-xl flex items-center justify-center space-x-3"
              >
                <span>💳</span>
                <span>Commander ce plan</span>
              </button>
              <p className="text-center text-xs text-gray-400 mt-4">Paiement sécurisé via Wave, Orange Money ou Carte Bancaire.</p>
            </div>
          </div>

        </div>

        {/* Section optionnelle : "Ce que contient ce pack d'autorisation" */}
        <div className="mt-16 bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contenu du Pack PDF d'Autorisation de Construire</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-gray-700 list-disc list-inside">
                <li>Plan de Situation (Adaptable par le client)</li>
                <li>Plan de Masse (Implantation de principe)</li>
                <li>Plans détaillés des niveaux (RDC, Étages, Toiture)</li>
                <li>Plans des 4 Façades cotées</li>
                <li>Plans de Coupes transversales et longitudinales</li>
                <li>Schéma de principe de l'Assainissement</li>
                <li>Note descriptive sommaire du projet</li>
            </ul>
        </div>

      </div>
    </div>
  );
};

export default VoirDetails;