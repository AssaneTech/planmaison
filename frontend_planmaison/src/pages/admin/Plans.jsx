import React, { useState, useEffect, useMemo } from "react";
import { 
  Search, Maximize, Bed, Bath, Plus, Edit2, Trash2, Loader2, 
  Save, X, Folder, FileText, Image as ImageIcon, Layout, ArrowLeft 
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

const API_URL = "http://localhost:5000/plans";

const Plans = () => {
  // --- ÉTATS ---
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  
  // État du formulaire (Add & Update)
  const [formData, setFormData] = useState({
    name: "", description: "", price: "", surface: "", 
    dimensions: "", rooms: "", type: "Villa", folder: "", 
    images: [""], pdfs: [""], isActive: true
  });

  // --- ACTIONS ---
  useEffect(() => { fetchPlans(); }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setPlans(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (plan = null) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({ ...plan });
    } else {
      setEditingPlan(null);
      setFormData({
        name: "", description: "", price: "", surface: "", 
        dimensions: "", rooms: "", type: "Villa", folder: "", 
        images: [""], pdfs: [""], isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer définitivement ce plan ?")) return;
    const t = toast.loading("Suppression...");
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Plan supprimé", { id: t });
        fetchPlans();
      }
    } catch (err) { toast.error("Erreur réseau", { id: t }); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const t = toast.loading(editingPlan ? "Mise à jour..." : "Publication...");
    const url = editingPlan ? `${API_URL}/${editingPlan._id}` : API_URL;
    const method = editingPlan ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          rooms: Number(formData.rooms)
        }),
      });

      if (res.ok) {
        toast.success(editingPlan ? "Plan mis à jour !" : "Plan publié !", { id: t });
        setIsModalOpen(false);
        fetchPlans();
      } else {
        toast.error("Erreur lors de l'enregistrement", { id: t });
      }
    } catch (err) { toast.error("Serveur injoignable", { id: t }); }
  };

  // --- GESTION DES LISTES DYNAMIQUES (Images/PDF) ---
  const handleArrayChange = (index, value, type) => {
    const newArray = [...formData[type]];
    newArray[index] = value;
    setFormData({ ...formData, [type]: newArray });
  };

  const addField = (type) => setFormData({ ...formData, [type]: [...formData[type], ""] });
  const removeField = (index, type) => setFormData({ ...formData, [type]: formData[type].filter((_, i) => i !== index) });

  // --- FILTRE ---
  const filteredPlans = useMemo(() => {
    return plans.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()));
  }, [plans, search]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-24 px-4 md:px-8 font-sans">
      <Toaster position="top-center" />
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-gray-950 tracking-tighter uppercase italic">
              Catalogue <span className="text-green-700">Plans</span>
            </h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-2">
              {plans.length} Modèles dans la base Atlas
            </p>
          </div>
          
          <button 
            onClick={() => handleOpenModal()}
            className="bg-gray-950 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-green-700 transition-all flex items-center gap-3 shadow-xl shadow-gray-200"
          >
            <Plus size={16} /> Nouveau Projet
          </button>
        </div>

        {/* BARRE DE RECHERCHE */}
        <div className="relative mb-10 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-green-700 transition-colors" size={18} />
          <input
            type="text"
            placeholder="RECHERCHER UN MODÈLE..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-16 pr-6 py-5 rounded-2xl bg-white border-none shadow-sm focus:ring-2 focus:ring-green-100 text-[11px] font-black uppercase tracking-widest transition-all"
          />
        </div>

        {/* LISTE DES PLANS */}
        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            <div className="text-center py-20 opacity-20 flex flex-col items-center">
              <Loader2 className="animate-spin mb-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Synchronisation...</span>
            </div>
          ) : filteredPlans.map((plan, index) => (
            <div key={plan._id} className="bg-white rounded-[2rem] border border-gray-100 p-4 flex items-center gap-6 hover:shadow-xl hover:shadow-gray-100 transition-all group">
              <div className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded-xl font-black text-gray-300 italic group-hover:text-green-700 transition-colors">
                {String(index + 1).padStart(2, '0')}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-black text-sm text-gray-950 uppercase italic truncate">{plan.name}</h3>
                  {!plan.isActive && <span className="px-2 py-0.5 bg-red-50 text-red-500 text-[7px] font-black rounded uppercase">Masqué</span>}
                </div>
                <div className="flex items-center gap-4 text-gray-400">
                  <div className="flex items-center gap-1 text-[9px] font-bold uppercase"><Bed size={12}/> {plan.rooms} Ch.</div>
                  <div className="flex items-center gap-1 text-[9px] font-bold uppercase"><Maximize size={12}/> {plan.surface}</div>
                  <div className="ml-auto mr-4 text-gray-950 font-black text-[11px]">{new Intl.NumberFormat().format(plan.price)} FCFA</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => handleOpenModal(plan)} className="p-3 bg-gray-50 text-gray-400 hover:bg-gray-950 hover:text-white rounded-xl transition-all"><Edit2 size={14} /></button>
                <button onClick={() => handleDelete(plan._id)} className="p-3 bg-red-50 text-red-500 hover:bg-red-600 hover:text-white rounded-xl transition-all"><Trash2 size={14} /></button>
              </div>

              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-50 border border-gray-50">
                <img src={plan.images?.[0] || "/placeholder.png"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- MODALE FULLSCREEN D'ÉDITION / AJOUT --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl my-auto animate-in fade-in zoom-in duration-300">
            <div className="p-8 md:p-12">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-black uppercase italic tracking-tighter">
                  {editingPlan ? "Modifier" : "Nouveau"} <span className="text-green-700">Projet</span>
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-3 bg-gray-50 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"><X size={20}/></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* LIGNE 1 */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase ml-2">Nom du Modèle</label>
                    <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-[11px] font-black uppercase" placeholder="VILLA F4 MODERN" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase ml-2">Dossier Racine</label>
                    <input type="text" required value={formData.folder} onChange={e => setFormData({...formData, folder: e.target.value})} className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-[11px] font-black" placeholder="plan_01" />
                  </div>
                </div>

                {/* LIGNE 2 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase ml-2">Prix (FCFA)</label>
                    <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-[11px] font-black text-green-700" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase ml-2">Surface</label>
                    <input type="text" value={formData.surface} onChange={e => setFormData({...formData, surface: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-[11px] font-black uppercase" placeholder="150 m²" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase ml-2">Chambres</label>
                    <input type="number" value={formData.rooms} onChange={e => setFormData({...formData, rooms: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-[11px] font-black" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase ml-2">Actif</label>
                    <select value={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.value === 'true'})} className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-[11px] font-black uppercase">
                      <option value="true">OUI</option>
                      <option value="false">NON</option>
                    </select>
                  </div>
                </div>

                {/* IMAGES & PDFS */}
                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center"><span className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-2"><ImageIcon size={14}/> Images</span><button type="button" onClick={() => addField('images')} className="text-green-700 text-lg">+</button></div>
                    {formData.images.map((url, i) => (
                      <div key={i} className="flex gap-2">
                        <input type="text" value={url} onChange={e => handleArrayChange(i, e.target.value, 'images')} className="flex-1 px-4 py-3 bg-gray-50 border-none rounded-xl text-[9px] font-medium" placeholder="Lien image" />
                        <button type="button" onClick={() => removeField(i, 'images')} className="text-red-300 hover:text-red-500"><Trash2 size={14}/></button>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center"><span className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-2"><FileText size={14}/> PDF Technique</span><button type="button" onClick={() => addField('pdfs')} className="text-green-700 text-lg">+</button></div>
                    {formData.pdfs.map((url, i) => (
                      <div key={i} className="flex gap-2">
                        <input type="text" value={url} onChange={e => handleArrayChange(i, e.target.value, 'pdfs')} className="flex-1 px-4 py-3 bg-gray-50 border-none rounded-xl text-[9px] font-medium" placeholder="Lien PDF" />
                        <button type="button" onClick={() => removeField(i, 'pdfs')} className="text-red-300 hover:text-red-500"><Trash2 size={14}/></button>
                      </div>
                    ))}
                  </div>
                </div>

                <button type="submit" className="w-full bg-gray-950 text-white py-6 rounded-3xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-green-700 transition-all shadow-xl flex items-center justify-center gap-3">
                  <Save size={18}/> {editingPlan ? "Mettre à jour le catalogue" : "Publier sur BaolMax"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Plans;