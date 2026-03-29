import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
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
      const res = await axios.post("http://localhost:5000/users/login", formData);
      
      console.log("Réponse serveur :", res.data); // <--- AJOUTE CECI POUR DEBOGUER

      if (res.data.user) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/"); 
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        
        <div className="text-center mb-8">
          <img src="/logo.png" className="h-10 mx-auto mb-3" alt="Logo" />
          <h1 className="text-2xl font-bold">
            Connexion <span className="text-green-700">PlanMaison</span>
          </h1>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" placeholder="exemple@email.com" value={formData.email} onChange={handleChange} required
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-200 outline-none transition" />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between">
              <label className="text-sm font-medium text-gray-700">Mot de passe</label>
              <Link to="/mot-de-passe-oublie" className="text-sm text-green-700 hover:underline">Oublié ?</Link>
            </div>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} name="password" placeholder="********" value={formData.password} onChange={handleChange} required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-200 outline-none transition" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition shadow-md shadow-green-100">
            {loading ? "Connexion en cours..." : "Se connecter"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Pas de compte ? <Link to="/register" className="text-green-700 font-bold hover:underline">S'inscrire</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;