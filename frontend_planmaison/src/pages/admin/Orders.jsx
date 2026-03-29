import React, { useEffect, useState } from "react";
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  Clock, 
  XCircle, 
  MoreVertical,
  Download
} from "lucide-react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("Tous");

  // Simulation de données (À lier à ton API /orders plus tard)
  useEffect(() => {
    const fakeOrders = [
      { id: "PM-1029", client: "Mamadou Diop", plan: "Villa Moderne F4", date: "28 Mars 2026", price: "75.000", status: "Payé", method: "Wave" },
      { id: "PM-1030", client: "Awa Ndiaye", plan: "Duplex R+1 Almadies", date: "27 Mars 2026", price: "150.000", status: "En attente", method: "Orange Money" },
      { id: "PM-1031", client: "Fatou Sow", plan: "Studio S+1 Mbour", date: "25 Mars 2026", price: "45.000", status: "Annulé", method: "Carte Bancaire" },
      { id: "PM-1032", client: "Ibrahima Fall", plan: "Villa Plain-pied 200m²", date: "24 Mars 2026", price: "90.000", status: "Payé", method: "Wave" },
    ];
    setOrders(fakeOrders);
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Payé": return "bg-green-100 text-green-700 border-green-200";
      case "En attente": return "bg-orange-100 text-orange-700 border-orange-200";
      case "Annulé": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Payé": return <CheckCircle size={12} />;
      case "En attente": return <Clock size={12} />;
      case "Annulé": return <XCircle size={12} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-28 px-6 pb-12 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* EN-TÊTE PAGE */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              <ShoppingBag className="text-green-700" size={32} />
              Gestion des Commandes
            </h1>
            <p className="text-gray-500 mt-1 font-medium italic">Suivez et validez les achats de plans en temps réel.</p>
          </div>
          
          <div className="flex items-center gap-3">
             <button className="bg-white border border-gray-200 p-3 rounded-2xl shadow-sm hover:bg-gray-50 transition">
                <Download size={20} className="text-gray-600" />
             </button>
             <button className="bg-green-700 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg hover:bg-green-800 transition transform active:scale-95">
                Exporter CSV
             </button>
          </div>
        </div>

        {/* BARRE DE RECHERCHE ET FILTRES */}
        <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100 mb-8 flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher un client ou un n° de commande..." 
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-green-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0">
            {["Tous", "Payé", "En attente", "Annulé"].map((item) => (
              <button 
                key={item}
                onClick={() => setFilter(item)}
                className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  filter === item 
                  ? "bg-gray-900 text-white shadow-md" 
                  : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* TABLEAU DES COMMANDES */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">ID Commande</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Client</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Plan / Produit</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Montant</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Statut</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-8 py-5">
                      <span className="font-black text-gray-900 text-sm italic">#{order.id}</span>
                      <p className="text-[10px] text-gray-400 font-bold">{order.date}</p>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-[10px]">
                          {order.client.charAt(0)}
                        </div>
                        <p className="text-sm font-bold text-gray-800">{order.client}</p>
                      </div>
                    </td>
                    <td className="px-8 py-5 font-medium text-sm text-gray-600">
                      {order.plan}
                    </td>
                    <td className="px-8 py-5 font-black text-gray-900 text-sm">
                      {order.price} FCFA
                      <p className="text-[10px] text-gray-400 font-medium">{order.method}</p>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusStyle(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <button className="p-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-green-700 hover:text-white transition-all shadow-sm">
                          <Eye size={16} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-900">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION SIMPLE */}
          <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs font-bold text-gray-500">Affichage de 1 à {orders.length} sur 42 commandes</p>
            <div className="flex gap-2">
               <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-400 cursor-not-allowed">Précédent</button>
               <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition shadow-sm">Suivant</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Orders;