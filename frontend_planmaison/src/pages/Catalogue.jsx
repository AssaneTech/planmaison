import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";

const plans = [
  {
    id: 1,
    image: "/plan-1.png",
    name: "Villa Moderne F4",
    price: 450000,
    surface: "150 m²",
    dimensions: "10m x 15m",
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

        {/* HEADER */}
        <div className="text-center mb-16 border-b border-gray-100 pb-12">
          <h1 className="text-5xl font-extrabold text-gray-950 mb-5">
            Catalogue de <span className="text-green-700">Plans</span>
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez des plans modernes adaptés aux terrains du Sénégal,
            prêts pour votre autorisation de construire.
          </p>
        </div>

        {/* SEARCH */}
        <div className="flex justify-center mb-16">
          <div className="relative w-full max-w-xl">
            <span className="absolute inset-y-0 left-0 flex items-center pl-5 text-gray-400">
              🔍
            </span>

            <input
              type="text"
              placeholder="Rechercher (villa, duplex, studio...)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-4 rounded-full 
              bg-white border border-gray-200 
              focus:outline-none focus:ring-2 focus:ring-green-200 
              transition text-lg"
            />
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredPlans.length > 0 ? (
            filteredPlans.map((plan) => (
              <div
                key={plan.id}
                className="group bg-white border border-gray-100 
                rounded-3xl overflow-hidden shadow-sm hover:shadow-xl 
                transition transform hover:-translate-y-2"
              >
                {/* IMAGE */}
                <div className="overflow-hidden">
                  <img
                    src={plan.image}
                    alt={plan.name}
                    className="w-full h-56 object-cover 
                    group-hover:scale-105 transition duration-500"
                  />
                </div>

                {/* CONTENT */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-green-700 transition">
                    {plan.name}
                  </h3>

                  {/* INFOS */}
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                    <p>📏 {plan.dimensions}</p>
                    <p>📐 {plan.surface}</p>
                  </div>

                  {/* PRICE */}
                  <p className="text-[#D4AF37] font-bold text-xl mb-5">
                    {formatPrice(plan.price)}
                  </p>

                  {/* BUTTON */}
                  <Link
                    to={`/details/${plan.id}`}
                    className="block text-center bg-green-700 text-white 
                    py-3 rounded-full font-semibold hover:bg-green-600 transition"
                  >
                    Voir détails
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16 bg-white rounded-2xl border">
              <p className="text-gray-500 text-lg">
                Aucun plan trouvé.
              </p>
              <button
                onClick={() => setSearch("")}
                className="mt-4 text-green-700 font-semibold hover:underline"
              >
                Réinitialiser
              </button>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-24 bg-green-800 p-12 rounded-3xl text-white text-center">
          <h3 className="text-2xl font-bold mb-4">
            Vous ne trouvez pas votre plan ?
          </h3>

          <p className="text-green-100 mb-6">
            Demandez un plan sur mesure adapté à votre terrain.
          </p>

          <Link
            to="/sur-mesure"
            className="bg-[#D4AF37] text-black px-8 py-3 rounded-full font-semibold hover:opacity-90"
          >
            Plan sur mesure
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Catalogue;