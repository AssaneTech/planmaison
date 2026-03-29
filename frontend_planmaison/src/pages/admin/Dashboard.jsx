import React, { useEffect, useState } from "react";
import { 
  Users, 
  Map, 
  ShoppingCart, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ArrowUpRight, 
  ShoppingBag,
  DollarSign
} from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPlans: 0,
    totalOrders: 0,
    totalRevenue: "0"
  });

  // Simulation de chargement des données
  useEffect(() => {
    // Plus tard, tu remplaceras ceci par un appel axios vers ton backend
    const timer = setTimeout(() => {
      setStats({
        totalUsers: 12,
        totalPlans: 8,
        totalOrders: 5,
        totalRevenue: "450.000"
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const cards = [
    { label: "Utilisateurs", value: stats.totalUsers, icon: <Users size={24} />, color: "bg-blue-600", trend: "+2 ce mois" },
    { label: "Plans en Ligne", value: stats.totalPlans, icon: <Map size={24} />, color: "bg-green-600", trend: "Actifs" },
    { label: "Commandes", value: stats.totalOrders, icon: <ShoppingCart size={24} />, color: "bg-orange-500", trend: "+5%" },
    { label: "Revenus", value: `${stats.totalRevenue} FCFA`, icon: <DollarSign size={24} />, color: "bg-purple-600", trend: "Total" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-28 px-6 pb-12 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* EN-TÊTE */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Tableau de bord</h1>
            <p className="text-gray-500 mt-1 font-medium italic">Content de vous revoir, Admin Baolmax.</p>
          </div>
          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
            <div className="bg-green-100 p-2 rounded-xl text-green-700 font-bold text-xs">
              LIVE
            </div>
            <p className="text-xs font-bold text-gray-400 mr-2">Statistiques en temps réel</p>
          </div>
        </div>

        {/* GRILLE DE CARTES STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {cards.map((card, i) => (
            <div key={i} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className={`${card.color} p-4 rounded-2xl text-white shadow-lg`}>
                  {card.icon}
                </div>
                <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded-lg flex items-center gap-1 uppercase tracking-tighter">
                  {card.trend}
                </span>
              </div>
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{card.label}</p>
              <h2 className="text-2xl font-black text-gray-900 mt-1">{card.value}</h2>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* SECTION COMMANDES RÉCENTES */}
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-gray-900">Dernières Ventes</h3>
              <button className="text-xs font-bold text-green-700 bg-green-50 px-4 py-2 rounded-full hover:bg-green-100 transition">
                Voir tout le catalogue
              </button>
            </div>
            
            <div className="space-y-4">
              {[1, 2, 3].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-5 rounded-3xl bg-gray-50 border border-gray-100 hover:border-green-200 transition-colors">
                  <div className="flex items-center gap-5">
                    <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-sm">
                      <ShoppingBag className="text-green-700" size={24} />
                    </div>
                    <div>
                      <p className="font-black text-gray-900 text-sm italic">PLAN #PM-00{i+1}</p>
                      <p className="text-xs text-gray-500 font-medium tracking-tight flex items-center gap-1">
                         <Users size={12}/> Client: Utilisateur_{i+10}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-gray-900 text-md">75.000 FCFA</p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                       <CheckCircle size={10} className="text-green-600"/>
                       <span className="text-[9px] font-bold text-green-600 uppercase">Payé</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION ACTIVITÉS RÉCENTES */}
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8">
            <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-2">
              <Clock size={20} className="text-blue-600" /> Flux d'activité
            </h3>
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[9px] before:w-0.5 before:bg-gray-100">
              
              <div className="relative flex gap-4 pl-6">
                <div className="absolute left-0 mt-1.5 w-5 h-5 bg-blue-600 rounded-full border-4 border-white shadow-sm flex items-center justify-center"></div>
                <div>
                  <p className="text-sm font-black text-gray-900 leading-tight">Nouveau Plan</p>
                  <p className="text-[11px] text-gray-500 font-medium">Villa F4 Dakar Plateau ajouté par Admin</p>
                  <p className="text-[9px] text-gray-400 mt-1 uppercase font-bold tracking-tighter">Il y a 2h</p>
                </div>
              </div>

              <div className="relative flex gap-4 pl-6">
                <div className="absolute left-0 mt-1.5 w-5 h-5 bg-green-600 rounded-full border-4 border-white shadow-sm"></div>
                <div>
                  <p className="text-sm font-black text-gray-900 leading-tight">Vente réalisée</p>
                  <p className="text-[11px] text-gray-500 font-medium">Plan moderne 200m² vendu à Mbour</p>
                  <p className="text-[9px] text-gray-400 mt-1 uppercase font-bold tracking-tighter">Il y a 5h</p>
                </div>
              </div>

              <div className="relative flex gap-4 pl-6">
                <div className="absolute left-0 mt-1.5 w-5 h-5 bg-red-500 rounded-full border-4 border-white shadow-sm"></div>
                <div>
                  <p className="text-sm font-black text-gray-900 leading-tight">Alerte Paiement</p>
                  <p className="text-[11px] text-gray-500 font-medium">Tentative Wave échouée (User_4)</p>
                  <p className="text-[9px] text-gray-400 mt-1 uppercase font-bold tracking-tighter">Hier</p>
                </div>
              </div>

            </div>

            <button className="w-full mt-12 py-4 rounded-[1.5rem] bg-gray-950 text-white text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-95">
              Télécharger le rapport mensuel
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;