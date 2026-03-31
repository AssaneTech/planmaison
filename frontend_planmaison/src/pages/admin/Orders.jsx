import React, { useEffect, useState } from "react";
import { 
  ShoppingBag, Search, Download, Trash2, Plus, 
  ChevronRight, Calendar, User, FileText, X 
} from "lucide-react";


const API_URL = import.meta.env.VITE_API_URL;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("Tous");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newOrder, setNewOrder] = useState({ userId: "", planId: "", amount: "", status: "Completed" });

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/orders`);
      const data = await res.json();
      setOrders(data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleCreateOrder = async () => {
    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder)
      });
      const data = await res.json();
      setOrders((prev) => [data, ...prev]);
      setShowModal(false);
    } catch (err) { alert("Erreur création"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette commande ?")) return;
    await fetch(`${API_URL}/orders/${id}`, { method: "DELETE" });
    setOrders((prev) => prev.filter((o) => o._id !== id));
  };

  const handleUpdateStatus = async (id, status) => {
    const res = await fetch(`${API_URL}/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    const updated = await res.json();
    setOrders((prev) => prev.map((o) => (o._id === id ? updated : o)));
  };

  const filteredOrders = orders.filter((o) => {
    const matchF = filter === "Tous" || (filter === "Payé" && o.status === "Completed");
    const matchS = o.orderReference?.toLowerCase().includes(search.toLowerCase());
    return matchF && matchS;
  });

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-800 font-sans antialiased p-4 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER CHIC */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
          <div className="space-y-1">
            <h1 className="text-4xl font-light tracking-tight flex items-center gap-4">
              <span className="bg-emerald-600 text-white p-2 rounded-2xl shadow-lg shadow-emerald-100">
                <ShoppingBag size={28} strokeWidth={1.5} />
              </span>
              Gestion <span className="font-serif italic">Commandes</span>
            </h1>
            <p className="text-slate-400 text-sm ml-16">Tableau de bord BAOLMAX Premium</p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="group relative px-6 py-3 bg-slate-900 text-white rounded-full overflow-hidden transition-all hover:pr-12 active:scale-95 shadow-xl shadow-slate-200"
          >
            <span className="font-medium tracking-wide">Nouvelle Entrée</span>
            <Plus className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all" size={18} />
          </button>
        </header>

        {/* TOOLS BAR */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
            <input
              placeholder="Rechercher une référence..."
              className="w-full pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-3xl focus:outline-none focus:ring-4 focus:ring-emerald-50 transition-all shadow-sm"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex bg-slate-100 p-1.5 rounded-3xl self-center">
            {["Tous", "Payé"].map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-8 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                  filter === t ? "bg-white text-emerald-700 shadow-md" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* LISTING STYLE TABLEAU CHIC */}
        <div className="bg-white rounded-[2rem] border border-slate-50 shadow-2xl shadow-slate-100/50 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/30">
                <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-slate-400">Commande</th>
                <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-slate-400">Client & Projet</th>
                <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-slate-400">Investissement</th>
                <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-slate-400">Statut</th>
                <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredOrders.map((o) => (
                <tr key={o._id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <span className="font-mono text-emerald-600 font-bold tracking-tighter">#{o.orderReference}</span>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1 uppercase font-black">
                      <Calendar size={10} /> {new Date().toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs uppercase">
                        {o.user?.firstName?.substring(0,2) || "CL"}
                      </div>
                      <div>
                        <p className="font-bold text-slate-700">{o.user?.firstName || "Client Anonyme"}</p>
                        <p className="text-xs text-slate-400 italic flex items-center gap-1"><FileText size={10}/> {o.plan?.name || "Modèle Standard"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-lg font-light text-slate-900">{Number(o.amount).toLocaleString()} <small className="text-[10px] font-bold">FCFA</small></span>
                  </td>
                  <td className="px-8 py-6">
                    <select
                      value={o.status}
                      onChange={(e) => handleUpdateStatus(o._id, e.target.value)}
                      className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-lg border-none focus:ring-0 cursor-pointer transition-colors ${
                        o.status === "Completed" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      <option value="Completed">PAYÉ</option>
                      <option value="Pending">ATTENTE</option>
                    </select>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a
                        href={`${API_URL}${o.downloadUrl}`}
                        target="_blank"
                        className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                        title="Télécharger"
                      >
                        <Download size={18} />
                      </a>
                      <button 
                        onClick={() => handleDelete(o._id)}
                        className="p-2.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                        title="Supprimer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <div className="p-20 text-center space-y-4">
              <p className="text-slate-300 italic font-serif text-lg">Aucune commande n'éclaire cette liste pour le moment...</p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL DESIGN LUXE */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setShowModal(false)} />
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 transform transition-all animate-in fade-in zoom-in duration-300">
            <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900 transition-colors">
              <X size={24} />
            </button>
            
            <h2 className="text-3xl font-light mb-8 italic">Nouvelle <span className="font-bold not-italic">Commande</span></h2>
            
            <div className="space-y-6">
              {[
                { label: "ID Client", key: "userId", icon: <User size={16}/> },
                { label: "ID Plan", key: "planId", icon: <FileText size={16}/> },
                { label: "Montant (FCFA)", key: "amount", icon: null }
              ].map((field) => (
                <div key={field.key} className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">{field.label}</label>
                  <div className="relative">
                    <input
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-emerald-500 transition-all text-sm font-medium"
                      onChange={(e) => setNewOrder({ ...newOrder, [field.key]: e.target.value })}
                    />
                  </div>
                </div>
              ))}

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">État de la transaction</label>
                <select
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-medium focus:ring-2 focus:ring-emerald-500"
                  onChange={(e) => setNewOrder({ ...newOrder, status: e.target.value })}
                >
                  <option value="Completed">Validée / Payée</option>
                  <option value="Pending">En attente de fonds</option>
                </select>
              </div>

              <button
                onClick={handleCreateOrder}
                className="w-full bg-slate-900 text-white py-5 rounded-3xl font-bold uppercase tracking-[0.2em] text-xs shadow-xl shadow-slate-200 hover:bg-emerald-700 transition-all mt-4 active:scale-95"
              >
                Inscrire au registre
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;