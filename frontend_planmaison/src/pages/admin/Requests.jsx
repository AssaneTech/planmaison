import React, { useEffect, useState } from "react";
import { 
  FileText, Download, MessageCircle, Calendar, 
  User, Map, Layout, Trash2, Search, ExternalLink 
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

const API_URL = "http://localhost:5000";

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch(`${API_URL}/customrequests`);
      const data = await res.json();
      if (res.ok) {
        setRequests(data);
      }
    } catch (err) {
      toast.error("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette demande définitivement ?")) return;
    try {
      const res = await fetch(`${API_URL}/customrequests/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Demande supprimée");
        setRequests(requests.filter(r => r._id !== id));
      }
    } catch (err) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const filteredRequests = requests.filter(req => 
    req.nomComplet.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.reference?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-20 px-6">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto">
        {/* HEADER & SEARCH */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-gray-950 uppercase tracking-tighter italic">
              Gestion des <span className="text-green-700">Demandes</span>
            </h1>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
              Projets sur mesure & Consulting technique
            </p>
          </div>

          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-green-600 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher (Nom ou Réf...)"
              className="pl-12 pr-6 py-4 bg-white border-none rounded-2xl shadow-sm text-xs font-bold focus:ring-2 focus:ring-green-100 w-full md:w-80"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* TABLEAU DES DEMANDES */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-950 text-white">
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest">Référence / Date</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest">Client</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest">Détails Terrain</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest">Documents</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr><td colSpan="5" className="p-20 text-center text-gray-400 font-bold uppercase text-xs tracking-widest">Chargement des données...</td></tr>
                ) : filteredRequests.length === 0 ? (
                  <tr><td colSpan="5" className="p-20 text-center text-gray-400 font-bold uppercase text-xs tracking-widest">Aucune demande trouvée</td></tr>
                ) : (
                  filteredRequests.map((req) => (
                    <tr key={req._id} className="hover:bg-gray-50/50 transition-colors">
                      {/* REF & DATE */}
                      <td className="p-6">
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-green-700">{req.reference || "N/A"}</span>
                          <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1 mt-1">
                            <Calendar size={10} /> {new Date(req.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </td>

                      {/* CLIENT INFO */}
                      <td className="p-6">
                        <div className="flex flex-col">
                          <span className="text-xs font-extrabold text-gray-900 uppercase tracking-tight">{req.nomComplet}</span>
                          <span className="text-[10px] text-gray-500 font-medium lowercase">{req.email}</span>
                        </div>
                      </td>

                      {/* TERRAIN & PIÈCES */}
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                            <Map size={12} className="text-gray-400" /> {req.dimensionsTerrain}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                            <Layout size={12} className="text-gray-400" /> {req.nombrePieces}p
                          </div>
                        </div>
                      </td>

                      {/* DOCUMENT (EXTRAIT DE PLAN) */}
                      <td className="p-6">
                        {req.fichierTerrain ? (
                          <a 
                            href={`${API_URL}${req.fichierTerrain}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition group"
                          >
                            <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition">
                              <Download size={16} />
                            </div>
                            <span className="text-[10px] font-black uppercase">Extrait Plan</span>
                          </a>
                        ) : (
                          <span className="text-[9px] font-black text-gray-300 uppercase italic">Aucun fichier</span>
                        )}
                      </td>

                      {/* ACTIONS ACTIONS */}
                      <td className="p-6 text-right">
                        <div className="flex items-center justify-end gap-3">
                          {/* Bouton WhatsApp direct */}
                          <a 
                            href={`https://wa.me/${req.telephone.replace(/\s/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm"
                            title="Répondre sur WhatsApp"
                          >
                            <MessageCircle size={18} />
                          </a>

                          <button 
                            onClick={() => handleDelete(req._id)}
                            className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* STATS RAPIDES */}
        <div className="grid md:grid-cols-3 gap-6 mt-10">
            <div className="bg-gray-950 p-8 rounded-3xl text-white">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Total Demandes</p>
                <h3 className="text-4xl font-black italic">{requests.length}</h3>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <p className="text-[10px] font-black text-green-700 uppercase tracking-widest mb-2">Fichiers Reçus</p>
                <h3 className="text-4xl font-black italic">{requests.filter(r => r.fichierTerrain).length}</h3>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Demandes ce mois</p>
                <h3 className="text-4xl font-black italic text-gray-950">
                    {requests.filter(r => new Date(r.createdAt).getMonth() === new Date().getMonth()).length}
                </h3>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Requests;