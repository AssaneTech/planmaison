import React, { useState, useEffect, useMemo } from "react";
import {
  Search, Maximize, Bed, Plus, Edit2, Trash2, Loader2,
  Save, X, FileText, Image as ImageIcon
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  const [formData, setFormData] = useState({
    name: "", description: "", price: "", surface: "",
    dimensions: "", rooms: "", type: "Villa", folder: "",
    images: [""], pdfs: [""], isActive: true
  });

  // 🔥 FETCH PLANS
  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/plans`);

      if (!res.ok) {
        throw new Error("Erreur serveur");
      }

      const data = await res.json();
      setPlans(Array.isArray(data) ? data : []);

    } catch (err) {
      console.error(err);
      toast.error("Impossible de charger les plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // 🔥 OPEN MODAL
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

  // 🔥 DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce plan ?")) return;

    const t = toast.loading("Suppression...");
    try {
      const res = await fetch(`${API_URL}/plans/${id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        toast.success("Supprimé", { id: t });
        fetchPlans();
      } else {
        toast.error("Erreur suppression", { id: t });
      }
    } catch {
      toast.error("Erreur réseau", { id: t });
    }
  };

  // 🔥 CREATE / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    const t = toast.loading(editingPlan ? "Mise à jour..." : "Création...");

    const url = editingPlan
      ? `${API_URL}/plans/${editingPlan._id}`
      : `${API_URL}/plans`;

    const method = editingPlan ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          rooms: Number(formData.rooms)
        })
      });

      if (res.ok) {
        toast.success("Succès !", { id: t });
        setIsModalOpen(false);
        fetchPlans();
      } else {
        toast.error("Erreur serveur", { id: t });
      }
    } catch {
      toast.error("Serveur indisponible", { id: t });
    }
  };

  // 🔥 FILTER
  const filteredPlans = useMemo(() => {
    return plans.filter(p =>
      p.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [plans, search]);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-6">
      <Toaster position="top-center" />

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between mb-8">
          <h1 className="text-3xl font-black">
            Plans <span className="text-green-600">BAOLMAX</span>
          </h1>

          <button
            onClick={() => handleOpenModal()}
            className="bg-black text-white px-6 py-3 rounded-xl"
          >
            <Plus size={16} /> Ajouter
          </button>
        </div>

        {/* SEARCH */}
        <input
          placeholder="Rechercher..."
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-6 p-4 border rounded-xl"
        />

        {/* LIST */}
        {loading ? (
          <div className="flex justify-center p-20">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPlans.map(plan => (
              <div key={plan._id} className="p-4 bg-white rounded-xl shadow flex justify-between">

                <div>
                  <h3 className="font-bold">{plan.name}</h3>
                  <p>{plan.rooms} chambres • {plan.surface}</p>
                  <p className="text-green-600 font-bold">{plan.price} FCFA</p>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => handleOpenModal(plan)}>
                    <Edit2 size={16} />
                  </button>

                  <button onClick={() => handleDelete(plan._id)}>
                    <Trash2 size={16} />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">

            <h2 className="mb-4 font-bold">
              {editingPlan ? "Modifier" : "Ajouter"} un plan
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input placeholder="Nom" required value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full border p-3 rounded" />

              <input placeholder="Prix" type="number" required value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
                className="w-full border p-3 rounded" />

              <input placeholder="Chambres" type="number" value={formData.rooms}
                onChange={e => setFormData({...formData, rooms: e.target.value})}
                className="w-full border p-3 rounded" />

              <button className="w-full bg-black text-white p-3 rounded">
                <Save size={16} /> Valider
              </button>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};

export default Plans;