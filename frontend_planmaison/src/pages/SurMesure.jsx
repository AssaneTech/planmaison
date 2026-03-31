import React, { useState } from "react";
import { 
  MessageCircle, Map, Layout, User, 
  Phone, Mail, Send, CheckCircle2 
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;
const WHATSAPP_NUMBER = "221765179069";

const SurMesure = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    nomComplet: "",
    telephone: "",
    email: "",
    dimensionsTerrain: "",
    nombrePieces: "",
    description: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Envoi au Backend (Route uniforme : /customrequests)
      const res = await fetch(`${API_URL}/customrequests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Demande enregistrée avec succès !");
        setSubmitted(true);
        
        // 2. Préparation du message WhatsApp Professionnel
        const message = 
          `*NOUVELLE DEMANDE DE PLAN SUR MESURE*%0A` +
          `*Référence :* ${result.reference}%0A` +
          `---------------------------%0A` +
          `*Client :* ${formData.nomComplet}%0A` +
          `*Téléphone :* ${formData.telephone}%0A` +
          `*Dimensions Terrain :* ${formData.dimensionsTerrain}%0A` +
          `*Nombre de Pièces :* ${formData.nombrePieces}%0A` +
          `*Description :* ${formData.description}`;

        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

        // 3. Redirection automatique vers WhatsApp après 2 secondes
        setTimeout(() => {
          window.open(whatsappUrl, "_blank");
        }, 2000);
      } else {
        toast.error("Erreur lors de l'envoi. Veuillez réessayer.");
      }
    } catch (err) {
      toast.error("Impossible de joindre le serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] pt-28 pb-20 px-4 font-sans">
      <Toaster position="top-right" />
      
      <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
        
        {/* HEADER SECTION */}
        <div className="bg-gray-950 p-10 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter mb-4">
              Conception <span className="text-green-500">Sur Mesure</span>
            </h2>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] max-w-lg mx-auto">
              Ingénierie Civile & Architecture personnalisée selon votre terrain
            </p>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        </div>

        {/* FORM SECTION */}
        <form onSubmit={handleSubmit} className="p-8 md:p-14 space-y-8">
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Nom Complet */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Identité</label>
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-green-600 transition-colors" size={18} />
                <input type="text" name="nomComplet" required onChange={handleChange} 
                  className="w-full pl-14 pr-6 py-5 bg-gray-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-green-100 transition-all" 
                  placeholder="NOM COMPLET" />
              </div>
            </div>

            {/* Téléphone */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Contact WhatsApp</label>
              <div className="relative group">
                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-green-600 transition-colors" size={18} />
                <input type="tel" name="telephone" required onChange={handleChange} 
                  className="w-full pl-14 pr-6 py-5 bg-gray-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-green-100 transition-all" 
                  placeholder="7X XXX XX XX" />
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Email pour les plans</label>
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-green-600 transition-colors" size={18} />
              <input type="email" name="email" required onChange={handleChange} 
                className="w-full pl-14 pr-6 py-5 bg-gray-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-green-100 transition-all" 
                placeholder="VOTRE@EMAIL.COM" />
            </div>
          </div>

          {/* Technique : Terrain & Pièces */}
          <div className="grid md:grid-cols-2 gap-6 pt-4">
            <div className="relative group">
              <Map className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input type="text" name="dimensionsTerrain" required onChange={handleChange} 
                className="w-full pl-14 pr-6 py-5 bg-gray-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-green-100 transition-all" 
                placeholder="DIMENSIONS (ex: 20x20m)" />
            </div>
            <div className="relative group">
              <Layout className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input type="number" name="nombrePieces" required onChange={handleChange} 
                className="w-full pl-14 pr-6 py-5 bg-gray-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-green-100 transition-all" 
                placeholder="NOMBRE DE PIÈCES" />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Détails du projet</label>
            <textarea name="description" rows="5" required onChange={handleChange} 
              className="w-full p-6 bg-gray-50 border-none rounded-[1.5rem] text-xs font-bold focus:ring-2 focus:ring-green-100 transition-all resize-none" 
              placeholder="Décrivez votre besoin (étages, style moderne, garage...)" />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading || submitted}
              className={`w-full py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 ${
                submitted ? "bg-green-600 text-white" : "bg-gray-950 text-white hover:bg-green-700 shadow-green-100"
              }`}
            >
              {loading ? (
                "Traitement en cours..."
              ) : submitted ? (
                <><CheckCircle2 size={18} /> Demande transmise</>
              ) : (
                <><MessageCircle size={18} /> Envoyer et Ouvrir WhatsApp</>
              )}
            </button>
          </div>

          <p className="text-center text-[8px] font-black text-gray-300 uppercase tracking-[0.4em]">
            Service d'ingénierie certifié • Réponse sous 48h
          </p>
        </form>
      </div>
    </div>
  );
};

export default SurMesure;