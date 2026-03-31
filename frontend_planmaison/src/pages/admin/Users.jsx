import React, { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { 
  Search, Loader2, MapPin, RefreshCw, Trash2, Edit3, X, Save, UserPlus 
} from "lucide-react";


const API_URL = import.meta.env.VITE_API_URL;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", password: "", phone: "", address: "Mbour", role: "client"
  });

  // RÉCUPÉRATION
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Erreur de liaison avec Atlas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // OUVERTURE MODALE
  const handleOpenModal = (user = null) => {
    if (user) {
        setEditingUser(user);
        setFormData({ 
            firstName: user.firstName || "", 
            lastName: user.lastName || "", 
            email: user.email || "", 
            phone: user.phone || "", 
            address: user.address || "Mbour", 
            role: user.role || "client",
            password: "" // <--- TOUJOURS VIDE À L'OUVERTURE
        });
    } else {
        setEditingUser(null);
        setFormData({ firstName: "", lastName: "", email: "", password: "", phone: "", address: "Mbour", role: "client" });
    }
    setIsModalOpen(true);
};

  // SUPPRESSION
  const handleDelete = async (id) => {
    if (!window.confirm("Confirmer la suppression ?")) return;
    
    const t = toast.loading("Suppression...");
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Membre retiré", { id: t });
        fetchUsers();
      } else {
        toast.error("Échec de suppression", { id: t });
      }
    } catch (err) {
      toast.error("Erreur réseau", { id: t });
    }
  };

  // AJOUT OU ÉDITION (C'est ici que ça se joue)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const t = toast.loading(editingUser ? "Mise à jour..." : "Création...");
    
    // Si editingUser existe, on fait un PUT sur l'ID, sinon un POST sur /register
    const url = editingUser ? `${API_URL}/${editingUser._id}` : `${API_URL}/register`;
    const method = editingUser ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(editingUser ? "Fichier bien édité !" : "Ajout avec succès !", { id: t });
        setIsModalOpen(false);
        fetchUsers(); // Recharger la liste
      } else {
        const errData = await res.json();
        toast.error(errData.msg || "Erreur", { id: t });
      }
    } catch (err) {
      toast.error("Le serveur ne répond pas", { id: t });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-6">
      <Toaster position="top-center" />
      
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">
            Base <span className="text-green-600">BAOLMAX</span>
          </h1>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-black text-white px-6 py-3 rounded-xl font-bold uppercase text-[10px] flex items-center gap-2 hover:bg-green-600 transition-all"
          >
            <UserPlus size={16} /> Nouveau Membre
          </button>
        </div>

        {/* LISTE DES USERS */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-green-600" /></div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="p-6 text-[10px] font-black uppercase text-gray-400">Membre</th>
                  <th className="p-6 text-[10px] font-black uppercase text-gray-400">Rôle</th>
                  <th className="p-6 text-[10px] font-black uppercase text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.filter(u => `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())).map(user => (
                  <tr key={user._id} className="hover:bg-gray-50/50">
                    <td className="p-6">
                      <p className="font-bold text-sm uppercase">{user.firstName} {user.lastName}</p>
                      <p className="text-[10px] text-gray-400">{user.email}</p>
                    </td>
                    <td className="p-6">
                      <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase ${user.role === 'admin' ? 'bg-black text-white' : 'bg-green-100 text-green-700'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-6 text-right space-x-2">
                      <button onClick={() => handleOpenModal(user)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit3 size={16}/></button>
                      <button onClick={() => handleDelete(user._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* MODALE DE FORMULAIRE */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl scale-up-center">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-black uppercase italic">{editingUser ? "Modifier" : "Ajouter"}</h2>
              <button onClick={() => setIsModalOpen(false)}><X /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Prénom" required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full p-4 bg-gray-50 rounded-xl text-sm font-bold uppercase" />
              <input type="text" placeholder="Nom" required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full p-4 bg-gray-50 rounded-xl text-sm font-bold uppercase" />
              <input type="email" placeholder="Email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-4 bg-gray-50 rounded-xl text-sm font-bold" />
              <input 
                    type="password" 
                    placeholder={editingUser ? "Nouveau mot de passe (laisser vide pour ne pas changer)" : "Mot de passe"} 
                    required={!editingUser} // Requis seulement pour un nouveau membre
                    value={formData.password} 
                    onChange={e => setFormData({...formData, password: e.target.value})} 
                    className="w-full p-4 bg-gray-50 rounded-xl text-sm font-bold" 
                />
              
              {!editingUser && (
                <input type="password" placeholder="Mot de passe" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full p-4 bg-gray-50 rounded-xl text-sm font-bold" />
              )}

              <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full p-4 bg-gray-50 rounded-xl text-sm font-bold uppercase">
                <option value="client">Client</option>
                <option value="admin">Administrateur</option>
              </select>

              <button type="submit" className="w-full bg-black text-white p-5 rounded-2xl font-black uppercase text-xs hover:bg-green-600 transition-all">
                <Save className="inline mr-2" size={16} /> Confirmer l'opération
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;