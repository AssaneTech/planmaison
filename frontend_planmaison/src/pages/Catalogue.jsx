import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";

// Données fictives (Pour l'ingénieur Software : à remplacer par un fetch API vers Strapi/Node.js plus tard)
const plans = [
  {
    id: 1,
    image: "/plan-1.png", // Rendu 3D de haute qualité
    name: "Villa Moderne F4",
    price: 450000,
    surface: "150 m²",
    dimensions: "10m x 15m", // Ajout d'info pertinente pour un ingénieur civil
  },
  {
    id: 2,
    image: "/plan-2.png",
    name: "Duplex Standing F5",
    price: 650000,
    surface: "220 m²",
    dimensions: "15m x 20m",
  },
  {
    id: 3,
    image: "/plan-3.png",
    name: "Studio Compact Éco",
    price: 250000,
    surface: "45 m²",
    dimensions: "8m x 12m",
  },
];

const Catalogue = () => {
  const [search, setSearch] = useState("");

  const filteredPlans = useMemo(() => {
    return plans.filter((plan) =>
      plan.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("fr-FR").format(price) + " FCFA";

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-24 px-4 md:px-8 text-gray-900">
      <div className="max-w-7xl mx-auto">
        
        {/* En-tête de page - Plus épuré */}
        <div className="text-center mb-16 border-b border-gray-100 pb-12">
          <h1 className="text-5xl font-extrabold text-gray-950 leading-tight mb-5 tracking-tight">
            Catalogue de <span className="text-indigo-600">Plans d'Autorisation</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
            Parcourez notre collection exclusive de plans architecturaux modernes, conçus rigoureusement selon les normes techniques sénégalaises pour une obtention rapide de votre permis de construire.
          </p>
        </div>

        {/* Barre de recherche - Design "Pill" plus moderne */}
        <div className="flex justify-center mb-20">
          <div className="relative w-full max-w-xl">
            <span className="absolute inset-y-0 left-0 flex items-center pl-5 text-gray-400">
                🔍
            </span>
            <input
              type="text"
              placeholder="Rechercher par type (villa, duplex, studio)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-4 rounded-full 
              bg-white border border-gray-100 
              shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-200 transition duration-300 text-lg"
            />
          </div>
        </div>

        {/* Grille de produits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredPlans.length > 0 ? (
            filteredPlans.map((plan) => (
              <div
                key={plan.id}
                className="group bg-white border border-gray-100 
                rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 ease-out transform hover:-translate-y-3"
              >
                {/* Image du plan (Rendu 3D) - Aspect ratio pour constance */}
                <div className="aspect-w-16 aspect-h-11 overflow-hidden bg-gray-100">
                  <img
                    src={plan.image}
                    alt={plan.name}
                    className="w-full h-full object-cover 
                    group-hover:scale-105 transition-transform duration-700 ease-in-out"
                  />
                </div>

                {/* Contenu de la Card - Espacements augmentés */}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-950 mb-3 group-hover:text-indigo-600 transition duration-300">
                    {plan.name}
                  </h3>

                  {/* Caractéristiques techniques en grille compacte */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600 mb-6 border-t border-gray-100 pt-4">
                    <p>📏 <span className="font-medium text-gray-800">{plan.dimensions}</span></p>
                    <p>📐 <span className="font-medium text-gray-800">{plan.surface}</span></p>
                    <p>📄 <span className="font-medium text-gray-800">Pack PDF Auto.</span></p>
                    <p>🗺️ <span className="font-medium text-gray-800">Sénégal Standard</span></p>
                  </div>

                  {/* Prix - Plus grand, police lourde */}
                  <p className="text-indigo-600 font-extrabold text-2xl mb-8">
                    {formatPrice(plan.price)}
                  </p>

                  {/* Bouton - Design "Pill", effet de hover plus chic */}
                  <Link
                    to={`/details/${plan.id}`}
                    className="block text-center bg-indigo-600 text-white 
                    px-6 py-4 rounded-full font-semibold hover:bg-indigo-700 transition duration-300 shadow-md hover:shadow-indigo-100 transform hover:scale-[1.02]"
                  >
                    Voir le plan complet
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <span className="text-5xl mb-6 block">🚧</span>
              <p className="text-xl text-gray-500">Aucun plan ne correspond à votre recherche technique.</p>
              <button onClick={() => setSearch('')} className="mt-6 text-indigo-600 hover:underline">Réinitialiser la recherche</button>
            </div>
          )}
        </div>

        {/* Section optionnelle : "Plans Sur-Mesure" */}
        <div className="mt-24 bg-indigo-700 p-12 md:p-16 rounded-3xl text-white flex flex-col md:flex-row justify-between items-center shadow-2xl">
            <div className="max-w-2xl text-center md:text-left mb-8 md:mb-0">
                <h3 className="text-3xl font-bold mb-4">Besoin d'un plan unique ?</h3>
                <p className="text-indigo-100 text-lg font-light">Nos ingénieurs civils dessinent votre maison sur-mesure pour votre terrain spécifique. Contactez-nous pour une étude personnalisée.</p>
            </div>
            <Link to="/sur-mesure" className="bg-white text-indigo-700 font-bold px-8 py-4 rounded-full text-lg hover:bg-indigo-50 transition duration-300 transform hover:scale-105">
                Demander un devis
            </Link>
        </div>

      </div>
    </div>
  );
};

export default Catalogue;