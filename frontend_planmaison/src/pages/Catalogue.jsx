import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:5000";

const Catalogue = () => {
  const [plans, setPlans] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("🔄 Fetching plans...");

    fetch(`${API_URL}/plans`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erreur serveur");
        }
        return res.json();
      })
      .then((data) => {
        console.log("✅ DATA:", data);
        setPlans(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ ERREUR:", err);
        setError("Impossible de charger les plans");
        setLoading(false);
      });
  }, []);

  const filteredPlans = useMemo(() => {
    return plans.filter((plan) =>
      plan.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [plans, search]);

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
            Découvrez des plans modernes adaptés aux terrains du Sénégal.
          </p>
        </div>

        {/* SEARCH */}
        <div className="flex justify-center mb-16">
          <div className="relative w-full max-w-xl">
            <input
              type="text"
              placeholder="🔍 Rechercher (villa, duplex...)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-6 py-4 rounded-full bg-white border border-gray-200 focus:ring-2 focus:ring-green-200"
            />
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="text-center py-20 text-gray-500">
            Chargement...
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="text-center py-20 text-red-500">
            {error}
          </div>
        )}

        {/* GRID */}
        {!loading && !error && (
          <div className="grid md:grid-cols-3 gap-10">
            {filteredPlans.length > 0 ? (
              filteredPlans.map((plan) => (
                <div key={plan.id} className="bg-white rounded-3xl shadow p-5">

                  <img
                    src={plan.images[0]}
                    alt={plan.name}
                    className="w-full h-52 object-cover rounded-xl mb-4"
                  />

                  <h3 className="font-bold text-lg">{plan.name}</h3>

                  <p className="text-sm text-gray-500">
                    {plan.dimensions} • {plan.surface}
                  </p>

                  <p className="text-[#D4AF37] font-bold text-xl mt-2">
                    {formatPrice(plan.price)}
                  </p>

                  <Link
                    to={`/details/${plan.id}`}
                    className="block mt-4 bg-green-700 text-white text-center py-2 rounded-xl"
                  >
                    Voir détails
                  </Link>

                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">
                Aucun plan trouvé
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Catalogue;