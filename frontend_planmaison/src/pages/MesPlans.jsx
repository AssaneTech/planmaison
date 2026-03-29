import React, { useState, useEffect } from "react";
import { 
  FileText, Download, Layout, Maximize, Bed, 
  Loader2, ChevronRight, Lock, CheckCircle2, Home
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000";

const MesPlans = () => {
  const navigate = useNavigate();
  const [purchasedPlans, setPurchasedPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 1. Récupérer l'utilisateur connecté depuis le localStorage
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (!savedUser) {
      navigate("/login");
      return;
    }
    setUser(savedUser);
    fetchUserPlans(savedUser._id);
  }, [navigate]);

  const fetchUserPlans = async (userId) => {
    try {
      // On récupère les infos complètes de l'utilisateur pour avoir ses purchasedPlans
      const res = await fetch(`${API_URL}/users/${userId}`);
      const data = await res.json();
      
      // Ici, on suppose que data.purchasedPlans contient les objets "Plan" complets
      // Si ta base ne contient que les IDs, il faudra faire un "populate" côté Backend
      setPurchasedPlans(data.purchasedPlans || []);
    } catch (err) {
      toast.error("Impossible de charger vos plans");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (pdfUrl, planName) => {
    toast.success(`Préparation du téléchargement : ${planName}`);
    window.open(pdfUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-white pt-32 pb-20 px-4 md:px-8">
      <Toaster position="bottom-right" />
      
      <div className="max-w-6xl mx-auto">
        {/* HEADER CLIENT */}
        <div className="mb-16">
          <div className="flex items-center gap-2 text-green-700 mb-4">
            <CheckCircle2 size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest text-green-700">Espace Propriétaire</span>
          </div>
          <h1 className="text-5xl font-black text-gray-950 tracking-tighter uppercase italic leading-none">
            Ma Plan<span className="text-green-700">thèque</span>
          </h1>
          <p className="text-gray-400 font-medium mt-4 max-w-lg">
            Retrouvez ici tous les plans architecturaux que vous avez acquis. Vous pouvez télécharger les dossiers techniques à tout moment.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-20 opacity-20">
            <Loader2 className="animate-spin mb-4" size={32} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Synchronisation de vos fichiers...</span>
          </div>
        ) : purchasedPlans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {purchasedPlans.map((plan) => (
              <div key={plan._id} className="group relative bg-gray-50 rounded-[2.5rem] overflow-hidden border border-transparent hover:border-green-200 transition-all duration-500">
                {/* Image du Plan */}
                <div className="aspect-[16/9] overflow-hidden">
                  <img 
                    src={plan.images?.[0] || "/placeholder-plan.jpg"} 
                    alt={plan.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-sm">
                    <span className="text-[10px] font-black uppercase text-gray-950 italic">Acquis ✅</span>
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-black uppercase italic text-gray-950 mb-1">{plan.name}</h3>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{plan.surface} • {plan.rooms} Chambres</p>
                    </div>
                    <div className="p-3 bg-white rounded-2xl shadow-sm text-green-700">
                      <Layout size={20} />
                    </div>
                  </div>

                  {/* Liste des PDFs disponibles */}
                  <div className="space-y-3">
                    {plan.pdfs && plan.pdfs.length > 0 ? (
                      plan.pdfs.map((pdf, idx) => (
                        <button 
                          key={idx}
                          onClick={() => handleDownload(pdf, plan.name)}
                          className="w-full flex items-center justify-between p-4 bg-white hover:bg-green-700 hover:text-white rounded-2xl transition-all group/btn shadow-sm"
                        >
                          <div className="flex items-center gap-3">
                            <FileText size={18} className="text-green-600 group-hover/btn:text-white" />
                            <span className="text-[11px] font-black uppercase">Dossier Technique #{idx + 1}</span>
                          </div>
                          <Download size={16} className="opacity-40 group-hover/btn:opacity-100" />
                        </button>
                      ))
                    ) : (
                      <p className="text-[10px] font-bold text-red-400 uppercase italic">Aucun fichier disponible pour le moment.</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ÉTAT VIDE */
          <div className="bg-gray-50 rounded-[3rem] p-16 text-center border-2 border-dashed border-gray-100">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-gray-300">
              <Lock size={32} />
            </div>
            <h3 className="text-xl font-black uppercase italic mb-2">Aucun plan acquis</h3>
            <p className="text-sm text-gray-400 mb-8 max-w-xs mx-auto">Votre bibliothèque est vide. Explorez notre catalogue pour trouver la maison de vos rêves.</p>
            <button 
              onClick={() => navigate("/plans")}
              className="bg-gray-950 text-white px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-green-700 transition-all flex items-center gap-3 mx-auto shadow-xl shadow-gray-200"
            >
              <Home size={16} /> Parcourir le catalogue
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MesPlans;