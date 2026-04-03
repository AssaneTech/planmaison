import React, { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { 
  Search, Loader2, Trash2, Edit3, X, Save, UserPlus 
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    address: "Mbour",
    role: "client"
  });

  // 🔥 FETCH USERS
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/users`);
      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔥 OPEN MODAL
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
        password: ""
      });
    } else {
      setEditingUser(null);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        address: "Mbour",
        role: "client"
      });
    }
    setIsModalOpen(true);
  };

  // 🔥 DELETE USER
  const handleDelete = async (id) => {
    if (!window.confirm("Confirmer la suppression ?")) return;

    const t = toast.loading("Suppression...");
    try {
      const res = await fetch(`${API_URL}/users/${id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        toast.success("Utilisateur supprimé", { id: t });
        fetchUsers();
      } else {
        toast.error("Échec suppression", { id: t });
      }
    } catch {
      toast.error("Erreur réseau", { id: t });
    }
  };

  // 🔥 CREATE / UPDATE USER
  const handleSubmit = async (e) => {
    e.preventDefault();

    const t = toast.loading(editingUser ? "Mise à jour..." : "Création...");

    const url = editingUser
      ? `${API_URL}/users/${editingUser._id}`
      : `${API_URL}/users/register`;

    const method = editingUser ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(editingUser ? "Modifié avec succès !" : "Ajout réussi !", { id: t });
        setIsModalOpen(false);
        fetchUsers();
      } else {
        toast.error(data.msg || "Erreur", { id: t });
      }
    } catch {
      toast.error("Serveur indisponible", { id: t });
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

        {/* TABLE */}
        <div className="bg-white rounded-[2rem] shadow-sm border overflow-hidden">
          {loading ? (
            <div className="p-20 flex justify-center">
              <Loader2 className="animate-spin text-green-600" />
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-6 text-xs font-bold text-gray-400">Membre</th>
                  <th className="p-6 text-xs font-bold text-gray-400">Rôle</th>
                  <th className="p-6 text-xs font-bold text-gray-400 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {users
                  .filter(u =>
                    `${u.firstName} ${u.lastName}`
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  )
                  .map(user => (
                    <tr key={user._id} className="border-b hover:bg-gray-50">
                      <td className="p-6">
                        <p className="font-bold">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </td>

                      <td className="p-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          user.role === "admin"
                            ? "bg-black text-white"
                            : "bg-green-100 text-green-700"
                        }`}>
                          {user.role}
                        </span>
                      </td>

                      <td className="p-6 text-right space-x-2">
                        <button onClick={() => handleOpenModal(user)}>
                          <Edit3 size={16} />
                        </button>

                        <button onClick={() => handleDelete(user._id)}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md">
            <h2 className="font-bold mb-4">
              {editingUser ? "Modifier" : "Ajouter"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input placeholder="Prénom" required value={formData.firstName}
                onChange={e => setFormData({...formData, firstName: e.target.value})}
                className="w-full border p-3 rounded" />

              <input placeholder="Nom" required value={formData.lastName}
                onChange={e => setFormData({...formData, lastName: e.target.value})}
                className="w-full border p-3 rounded" />

              <input placeholder="Email" required value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full border p-3 rounded" />

              <input type="password"
                placeholder="Mot de passe"
                required={!editingUser}
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full border p-3 rounded" />

              <select value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value})}
                className="w-full border p-3 rounded">
                <option value="client">Client</option>
                <option value="admin">Admin</option>
              </select>

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

export default Users;