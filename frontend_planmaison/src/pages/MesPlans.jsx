import React, { useState, useEffect, useCallback } from "react";
import { 
  FileText, Download, Layout, Loader2, 
  CheckCircle2, Home, Lock, AlertCircle, ExternalLink
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000";

const MesPlans = () => {
  const navigate = useNavigate();
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fonction pour récupérer l'utilisateur à jour avec ses plans "populés"
  const fetchUserLibrary = useCallback(async (userId) => {
    try {
      setLoading(true);
      setError(false);
      
      // Note : Ton backend doit faire .populate('purchasedPlans.plan') sur cette route
      const res = await fetch(`${API_URL}/users/${userId}`);
      if (!res.ok) throw new Error("Erreur lors de la récupération");
      
      const data = await res.json();

      // Mise à jour du localStorage pour garder les infos fraîches (nom, email, etc.)
      localStorage.setItem("user", JSON.stringify(data));
      
      // On stocke le tableau d'objets { plan, downloadUrl, purchasedAt }
      setPurchasedItems(data.purchasedPlans || []);

    } catch (err) {
      console.error(err);
      setError(true);
      toast.error("Impossible de charger votre bibliothèque.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (!savedUser || !savedUser._id) {
      navigate("/login");
      return;
    }
    fetchUserLibrary(savedUser._id);
  }, [navigate, fetchUserLibrary]);

  const handleDownload = (url, planName) => {
    if (!url) {
      toast.error("Lien de téléchargement non disponible.");
      return;
    }
    const fullUrl = url.startsWith('http') ? url : `${API_URL}${url}`;
    
    toast.success(`Ouverture du dossier : ${planName}`);
    window.open(fullUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] pt-32 pb-24 px-6 md:px-12">
      <Toaster position="top-center" />
      
      <div className="max-w-7xl mx-auto">
        
        {/* EN-TÊTE PRESTIGE */}
        <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-emerald-700">
              <div className="h-[1px] w-12 bg-emerald-200"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Propriété Certifiée</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase italic leading-[0.85]">
              Ma <span className="text-emerald-600">Collection</span>
            </h1>
            <p className="text-slate-400 font-light text-lg max-w-md">
              Votre coffre-fort numérique contenant l'intégralité de vos acquisitions architecturales.
            </p>
          </div>
          
          <div className="hidden lg:block pb-2">
             <div className="bg-slate-50 px-6 py-4 rounded-3xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 text-center">Plans Actifs</p>
                <p className="text-3xl font-black text-slate-900 text-center leading-none">{purchasedItems.length}</p>
             </div>
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <Loader2 className="animate-spin text-emerald-600 mb-6" size={40} strokeWidth={1.5} />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 animate-pulse">Accès au serveur sécurisé...</p>
          </div>
        ) : error ? (
          <div className="bg-rose-50/50 border border-rose-100 rounded-[3rem] p-20 text-center max-w-2xl mx-auto">
            <AlertCircle className="mx-auto text-rose-500 mb-6" size={48} />
            <h2 className="text-xl font-bold text-rose-900 mb-2 uppercase">Erreur de Synchronisation</h2>
            <p className="text-rose-600/70 text-sm mb-8 font-medium">Nous ne parvenons pas à récupérer vos titres de propriété immobilière.</p>
            <button onClick={() => window.location.reload()} className="px-8 py-4 bg-rose-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-rose-700 transition-all">Réessayer</button>
          </div>
        ) : purchasedItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {purchasedItems.map((item) => (
              <article key={item._id} className="group relative flex flex-col md:flex-row bg-white rounded-[2.5rem] shadow-2xl shadow-slate-100/50 border border-slate-50 overflow-hidden hover:-translate-y-2 transition-all duration-500">
                
                {/* IMAGE DU PLAN */}
                <div className="w-full md:w-2/5 aspect-[4/5] md:aspect-auto relative overflow-hidden bg-slate-100">
                  <img 
                    src={item.plan?.images?.[0] || "/placeholder-plan.jpg"} 
                    alt={item.plan?.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500"></div>
                </div>

                {/* CONTENU TECHNIQUE */}
                <div className="w-full md:w-3/5 p-8 md:p-10 flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <span className="bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase px-3 py-1.5 rounded-lg tracking-widest border border-emerald-100">
                      Licence Active
                    </span>
                    <Layout size={20} className="text-slate-200 group-hover:text-emerald-500 transition-colors" />
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter mb-2 leading-none">
                    {item.plan?.name || "Modèle Exclusif"}
                  </h3>
                  
                  <div className="flex gap-4 mb-8 text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                    <span>{item.plan?.surface} m²</span>
                    <span className="w-1 h-1 bg-slate-200 rounded-full self-center"></span>
                    <span>{item.plan?.rooms} Chambres</span>
                  </div>

                  {/* ACTION DE TÉLÉCHARGEMENT */}
                  <div className="mt-auto pt-8 border-t border-slate-50">
                    <button 
                      onClick={() => handleDownload(item.downloadUrl, item.plan?.name)}
                      className="w-full flex items-center justify-between px-6 py-5 bg-slate-900 text-white rounded-[1.5rem] hover:bg-emerald-700 transition-all duration-500 group/btn shadow-xl shadow-slate-200"
                    >
                      <div className="flex items-center gap-3">
                        <FileText size={18} className="text-emerald-400" />
                        <div className="text-left">
                          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-200/50 leading-none mb-1">Dossier Technique</p>
                          <p className="text-xs font-bold">TÉLÉCHARGER PDF HD</p>
                        </div>
                      </div>
                      <Download size={20} className="group-hover/btn:translate-y-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* ÉTAT VIDE DESIGN */
          <div className="bg-white rounded-[3.5rem] p-24 text-center shadow-2xl shadow-slate-100 border border-slate-50 max-w-3xl mx-auto flex flex-col items-center">
            <div className="relative mb-12">
              <div className="absolute -inset-8 bg-emerald-50 rounded-full blur-3xl opacity-50 animate-pulse"></div>
              <div className="relative w-28 h-28 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200 border border-slate-100 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                <Lock size={44} strokeWidth={1} />
              </div>
            </div>
            <h3 className="text-3xl font-black uppercase italic text-slate-900 mb-4 tracking-tighter">Votre bibliothèque est vide</h3>
            <p className="text-slate-400 text-lg font-light mb-12 max-w-[340px] leading-relaxed mx-auto">
              Vous n'avez pas encore acquis de propriété intellectuelle sur nos conceptions. 
            </p>
            <button 
              onClick={() => navigate("/catalogue")}
              className="bg-slate-900 text-white px-14 py-6 rounded-3xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-emerald-700 transition-all flex items-center gap-5 shadow-2xl shadow-slate-300 active:scale-95 group"
            >
              <Home size={18} /> Parcourir le catalogue <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MesPlans;