import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Map, Maximize, Bed, Bath, ArrowRight, Star } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const Catalogue = () => {
  const [plans, setPlans] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================================
  // 🔥 FETCH PLANS (ROBUSTE)
  // ================================
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch(`${API_URL}/plans`);

        if (!res.ok) {
          throw new Error("Erreur serveur");
        }

        const data = await res.json();

        // 🔒 Sécurise format backend
        const safeData = Array.isArray(data) ? data : data.plans || [];

        setPlans(safeData);
      } catch (err) {
        console.error("Erreur fetch plans:", err);
        setError("Impossible de charger les plans.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // ================================
  // 🔍 FILTRE RECHERCHE
  // ================================
  const filteredPlans = useMemo(() => {
    return plans.filter((plan) => {
      const name = plan.name?.toLowerCase() || "";
      const tags = plan.tags?.join(" ").toLowerCase() || "";

      return (
        name.includes(search.toLowerCase()) ||
        tags.includes(search.toLowerCase())
      );
    });
  }, [plans, search]);

  // ================================
  // 💰 FORMAT PRIX
  // ================================
  const formatPrice = (price) =>
    new Intl.NumberFormat("fr-FR").format(price || 0) + " FCFA";

  // ================================
  // 🎨 UI
  // ================================
  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-24 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-20">
          <h1 className="text-5xl font-black mb-4">
            Catalogue de <span className="text-green-700">Plans</span>
          </h1>
          <p className="text-gray-500">
            Découvrez nos modèles modernes adaptés au Sénégal
          </p>
        </div>

        {/* SEARCH */}
        <div className="flex justify-center mb-16">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un plan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border shadow-sm"
            />
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="text-center py-20">
            <p className="animate-pulse">Chargement des plans...</p>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="text-center text-red-500 font-bold py-10">
            {error}
          </div>
        )}

        {/* LIST */}
        {!loading && !error && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredPlans.length > 0 ? (
              filteredPlans.map((plan) => (
                <div
                  key={plan._id}
                  className="bg-white rounded-3xl shadow hover:shadow-xl transition overflow-hidden"
                >
                  {/* IMAGE */}
                  <div className="h-60 bg-gray-100">
                    <img
                      src={plan.images?.[0] || "/placeholder.png"}
                      alt={plan.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="p-6">

                    {/* TITLE */}
                    <h3 className="font-bold text-lg mb-2">
                      {plan.name || "Sans nom"}
                    </h3>

                    {/* PRICE */}
                    <p className="text-green-700 font-bold mb-4">
                      {formatPrice(plan.price)}
                    </p>

                    {/* FEATURES */}
                    <div className="flex justify-between text-sm text-gray-500 mb-6">
                      <span>{plan.surface || "N/A"}</span>
                      <span>{plan.rooms || 0} ch</span>
                      <span>{plan.bathrooms || 0} sdb</span>
                    </div>

                    {/* BUTTON */}
                    <Link
                      to={`/details/${plan._id}`}
                      className="block text-center bg-black text-white py-3 rounded-xl hover:bg-green-700 transition"
                    >
                      Voir détails
                    </Link>

                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-gray-500">
                Aucun résultat trouvé
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalogue;