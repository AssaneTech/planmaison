import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Maximize, Bed, Bath, FileText, CheckCircle, 
  ArrowLeft, ShoppingCart, ShieldCheck, Star, Layers 
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

/* ================= IMAGE ZOOM COMPONENT (Optimisé) ================= */
const ImageZoom = ({ src }) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const start = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const handleWheel = (e) => {
      e.preventDefault();
      const newZoom = Math.min(Math.max(zoom + e.deltaY * -0.001, 1), 4);
      setZoom(newZoom);
    };
    if (container) container.addEventListener("wheel", handleWheel, { passive: false });
    return () => { if (container) container.removeEventListener("wheel", handleWheel); };
  }, [zoom]);

  const handleMouseDown = (e) => {
    setDragging(true);
    start.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };
  const handleMouseUp = () => setDragging(false);
  const handleMouseMove = (e) => {
    if (!dragging || zoom <= 1) return;
    setPosition({ x: e.clientX - start.current.x, y: e.clientY - start.current.y });
  };
  const reset = () => { setZoom(1); setPosition({ x: 0, y: 0 }); };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
      onDoubleClick={reset}
      className="relative w-full h-[500px] overflow-hidden rounded-[2.5rem] bg-white border border-gray-100 shadow-inner cursor-grab active:cursor-grabbing"
    >
      <img
        src={src}
        alt="Plan détaillé"
        draggable={false}
        className="w-full h-full object-contain select-none p-4"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
          transition: dragging ? "none" : "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />
      {zoom > 1 && (
        <div className="absolute bottom-6 right-6 bg-black/50 backdrop-blur-md text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest">
          Double-clic pour réinitialiser
        </div>
      )}
    </div>
  );
};

/* ================= MAIN PAGE ================= */
const VoirDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/plans/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPlan(data);
        setSelectedImage(data.images?.[0]);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("fr-FR").format(price) + " FCFA";

  const getLabel = (index) => {
    const labels = ["Vue 3D", "Rez-de-chaussée", "Étage 1", "Étage 2"];
    return labels[index] || `Vue ${index + 1}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] pt-32 px-8 flex flex-col gap-8 animate-pulse">
        <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12">
          <div className="h-[500px] bg-white rounded-[2.5rem]"></div>
          <div className="space-y-6">
            <div className="h-10 bg-white rounded-full w-3/4"></div>
            <div className="h-6 bg-white rounded-full w-1/4"></div>
            <div className="h-40 bg-white rounded-[2rem]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!plan) return <div className="pt-32 text-center font-bold">Plan introuvable.</div>;

  return (
    <div className="bg-[#F8FAFC] min-h-screen pt-32 pb-20 px-4 md:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* TOP BAR / NAVIGATION */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate('/catalogue')}
            className="flex items-center gap-2 text-sm font-black text-gray-400 hover:text-green-700 transition-colors uppercase tracking-widest"
          >
            <ArrowLeft size={16} /> Retour au catalogue
          </button>
          <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full">
            <CheckCircle size={14} className="text-green-700" />
            <span className="text-[10px] font-black text-green-700 uppercase tracking-tighter">Disponible immédiatement</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          
          {/* LEFT: VISUALS */}
          <div className="space-y-6">
            <ImageZoom src={selectedImage} />
            
            <div className="grid grid-cols-4 gap-4 pt-2">
              {plan.images?.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setSelectedImage(img)}
                  className={`relative group rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                    selectedImage === img ? "border-green-700 shadow-lg scale-105" : "border-transparent hover:border-gray-200"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-20 object-cover" />
                  <div className={`absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors ${selectedImage === img ? "bg-transparent" : ""}`} />
                  <p className="absolute bottom-1 left-0 right-0 text-[8px] font-black text-white text-center uppercase drop-shadow-md">
                    {getLabel(i)}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: CONTENT */}
          <div className="flex flex-col">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 relative overflow-hidden">
              {/* Filigrane discret */}
              <Layers className="absolute -top-10 -right-10 text-gray-50 opacity-50" size={250} />

              <div className="relative z-10">
                <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.3em]">Modèle Exclusif</span>
                <h1 className="text-4xl font-black text-gray-950 mt-2 mb-4 tracking-tighter italic uppercase leading-none">
                  {plan.name}
                </h1>
                
                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-3xl font-black text-green-700 tracking-tighter">
                    {formatPrice(plan.price)}
                  </span>
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">TTC</span>
                </div>

                <p className="text-gray-500 font-medium leading-relaxed mb-8">
                  Ce dossier complet comprend tous les documents nécessaires pour votre demande de permis de construire au Sénégal et pour l'exécution des travaux.
                </p>

                {/* TECH GRID */}
                <div className="grid grid-cols-2 gap-4 mb-10">
                  <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100 flex items-center gap-4">
                    <div className="bg-white p-2.5 rounded-xl shadow-sm"><Maximize size={20} className="text-green-700"/></div>
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Surface habitable</p>
                      <p className="text-sm font-black text-gray-900">{plan.surface}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100 flex items-center gap-4">
                    <div className="bg-white p-2.5 rounded-xl shadow-sm"><Layers size={20} className="text-green-700"/></div>
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Dimensions</p>
                      <p className="text-sm font-black text-gray-900">{plan.dimensions}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100 flex items-center gap-4">
                    <div className="bg-white p-2.5 rounded-xl shadow-sm"><Bed size={20} className="text-green-700"/></div>
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Chambres</p>
                      <p className="text-sm font-black text-gray-900">{plan.chambres || "0"} Pièces</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100 flex items-center gap-4">
                    <div className="bg-white p-2.5 rounded-xl shadow-sm"><Bath size={20} className="text-green-700"/></div>
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Salles de bain</p>
                      <p className="text-sm font-black text-gray-900">{plan.douches || "0"} Douches</p>
                    </div>
                  </div>
                </div>

                {/* CTA BOX */}
                <div className="space-y-4">
                  <button
                    onClick={() => navigate("/finaliser-commande", { state: { plan } })}
                    className="w-full bg-gray-950 text-white py-6 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-green-700 transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-3 active:scale-95"
                  >
                    <ShoppingCart size={18} /> Acheter ce dossier PDF
                  </button>
                  <div className="flex items-center justify-center gap-4 text-gray-400">
                    <div className="flex items-center gap-1.5"><ShieldCheck size={14}/> <span className="text-[9px] font-bold uppercase tracking-tighter">Paiement 100% Sécurisé</span></div>
                    <div className="w-1.5 h-1.5 bg-gray-200 rounded-full"></div>
                    <div className="flex items-center gap-1.5"><FileText size={14}/> <span className="text-[9px] font-bold uppercase tracking-tighter">Téléchargement instantané</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PACK DETAILS SECTION */}
        <div className="mt-16 bg-white p-12 rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden relative">
           <div className="absolute top-0 right-0 p-8">
              <Star size={40} className="text-gray-50 fill-gray-50" />
           </div>
           
           <h2 className="text-2xl font-black text-gray-950 mb-8 flex items-center gap-3 uppercase italic tracking-tighter">
             <Layers className="text-green-700" /> Contenu de votre dossier
           </h2>

           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-12">
            {[
              "Plans d'architecte RDC et étages",
              "Façades détaillées (Nord, Sud, Est, Ouest)",
              "Coupes transversales et longitudinales",
              "Plan de masse et d'implantation",
              "Schémas de principe assainissement",
              "Note descriptive technique"
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-4 group">
                <div className="mt-1 bg-green-50 text-green-700 p-1 rounded-md group-hover:bg-green-700 group-hover:text-white transition-colors">
                  <CheckCircle size={14} />
                </div>
                <p className="text-sm font-bold text-gray-600 uppercase tracking-tight leading-relaxed">{item}</p>
              </div>
            ))}
           </div>
        </div>

      </div>
    </div>
  );
};

export default VoirDetails;