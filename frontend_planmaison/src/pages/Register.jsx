import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, Mail, Phone, Lock } from "lucide-react";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/users/register", formData);
      if (res.status === 201) {
        navigate("/connexion"); // Redirection vers login après succès
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Rejoindre <span className="text-green-700">PlanMaison</span>
          </h1>
          <p className="text-gray-500 text-sm mt-2">Créez votre compte pour gérer vos plans</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Prénom</label>
              <input type="text" name="firstName" placeholder="Assane" value={formData.firstName} onChange={handleChange} required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-200 outline-none transition" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Nom</label>
              <input type="text" name="lastName" placeholder="Diouf" value={formData.lastName} onChange={handleChange} required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-200 outline-none transition" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" placeholder="exemple@email.com" value={formData.email} onChange={handleChange} required
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-200 outline-none transition" />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Téléphone</label>
            <input type="text" name="phone" placeholder="77 000 00 00" value={formData.phone} onChange={handleChange} required
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-200 outline-none transition" />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Mot de passe</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} name="password" placeholder="********" value={formData.password} onChange={handleChange} required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-200 outline-none transition" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition shadow-md shadow-green-100 disabled:opacity-70">
            {loading ? "Création en cours..." : "S'inscrire"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Déjà un compte ? <Link to="/connexion" className="text-green-700 font-bold hover:underline">Se connecter</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;