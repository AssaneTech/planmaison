import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Map, Maximize, Bed, Bath, ArrowRight, Star } from "lucide-react";

const API_URL = "http://localhost:5000";

const Catalogue = () => {
  const [plans, setPlans] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/plans`)
      .then((res) => {
        if (!res.ok) throw new Error("Erreur serveur");
        return res.json();
      })
      .then((data) => {
        setPlans(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Impossible de charger les plans. Vérifiez la connexion au serveur.");
        setLoading(false);
      });
  }, []);

  const filteredPlans = useMemo(() => {
    return plans.filter((plan) =>
      plan.name?.toLowerCase().includes(search.toLowerCase()) ||
      plan.tags?.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
    );
  }, [plans, search]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("fr-FR").format(price) + " FCFA";

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-24 px-4 md:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* SECTION HEADER MODERNE */}
        <div className="relative mb-20 text-center">
          <span className="text-green-700 font-black text-[10px] uppercase tracking-[0.3em] bg-green-50 px-4 py-2 rounded-full">
            Architecture Premium
          </span>
          <h1 className="text-5xl md:text-6xl font-black text-gray-950 mt-6 mb-6 tracking-tighter">
            Catalogue de <span className="text-[#D4AF37]">Plans</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
            Explorez notre collection exclusive de villas modernes et duplex optimisés, 
            conçus spécifiquement pour l'élégance et le climat du Sénégal.
          </p>
        </div>

        {/* BARRE DE RECHERCHE STYLE "FLOATING" */}
        <div className="flex justify-center mb-20">
          <div className="relative w-full max-w-2xl group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-700 transition-colors" size={22} />
            <input
              type="text"
              placeholder="Rechercher une villa, un duplex, ou une surface (ex: 200m²)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-16 pr-8 py-6 rounded-[2rem] bg-white border-none shadow-2xl shadow-gray-200/50 focus:ring-2 focus:ring-green-100 text-lg transition-all placeholder:text-gray-300 font-medium"
            />
          </div>
        </div>

        {/* ETAT : CHARGEMENT (SKELETONS) */}
        {loading && (
          <div className="grid md:grid-cols-3 gap-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-[2.5rem] p-6 animate-pulse">
                <div className="w-full h-64 bg-gray-100 rounded-[2rem] mb-6"></div>
                <div className="h-6 w-3/4 bg-gray-100 rounded-full mb-4"></div>
                <div className="h-4 w-1/2 bg-gray-50 rounded-full"></div>
              </div>
            ))}
          </div>
        )}

        {/* ETAT : ERREUR */}
        {error && (
          <div className="text-center py-20 bg-red-50 rounded-[3rem] border border-red-100">
            <p className="text-red-600 font-black uppercase tracking-widest text-sm italic">{error}</p>
          </div>
        )}

        {/* GRID DE PLANS DYNAMIQUE */}
        {!loading && !error && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredPlans.length > 0 ? (
              filteredPlans.map((plan) => (
                <div key={plan._id} className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                  
                  {/* IMAGE AVEC OVERLAY PRIX */}
                  <div className="relative h-72 overflow-hidden m-3 rounded-[2rem]">
                    {plan.images?.length > 0 ? (
                      <img
                        src={plan.images[0]}
                        alt={plan.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300 italic">Image non disponible</div>
                    )}
                    <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2">
                       <Star size={14} className="text-[#D4AF37] fill-[#D4AF37]" />
                       <span className="text-[10px] font-black uppercase tracking-tighter text-gray-900">Populaire</span>
                    </div>
                  </div>

                  {/* CONTENU TECHNIQUE */}
                  <div className="p-8 pt-4">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="font-black text-xl text-gray-900 leading-tight uppercase italic">{plan.name}</h3>
                            <p className="text-gray-400 text-xs font-bold mt-1 flex items-center gap-1">
                                <Map size={12}/> {plan.dimensions || "Dimensions variées"}
                            </p>
                        </div>
                        <p className="text-green-700 font-black text-lg">
                            {formatPrice(plan.price)}
                        </p>
                    </div>

                    {/* FEATURES CHIPS */}
                    <div className="grid grid-cols-3 gap-2 py-4 border-y border-gray-50 mb-6 text-gray-500">
                        <div className="flex flex-col items-center gap-1 border-r border-gray-100">
                            <Maximize size={16} className="text-gray-400" />
                            <span className="text-[10px] font-black uppercase tracking-tighter">{plan.surface || "N/A"}</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 border-r border-gray-100">
                            <Bed size={16} className="text-gray-400" />
                            <span className="text-[10px] font-black uppercase tracking-tighter">{plan.chambres || 0} Ch.</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <Bath size={16} className="text-gray-400" />
                            <span className="text-[10px] font-black uppercase tracking-tighter">{plan.douches || 0} Sdb.</span>
                        </div>
                    </div>

                    {/* CTA BUTTON */}
                    <Link
                      to={`/details/${plan._id}`}
                      className="flex items-center justify-center gap-3 w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest group-hover:bg-green-700 transition-all shadow-xl shadow-gray-200"
                    >
                      Consulter le plan <ArrowRight size={16} />
                    </Link>

                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="text-gray-400" />
                </div>
                <p className="text-gray-500 font-bold italic text-lg">Aucun plan ne correspond à votre recherche.</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Catalogue;