import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    motDePasse: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    console.log("Login :", formData);

    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow p-8">

        {/* HEADER */}
        <div className="text-center mb-8">
          <img src="/logo.png" className="h-10 mx-auto mb-3" />
          <h1 className="text-2xl font-bold">
            Connexion <span className="text-green-700">PlanMaison</span>
          </h1>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* EMAIL */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="exemple@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-200"
            />
          </div>

          {/* PASSWORD */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">
                Mot de passe
              </label>

              <Link
                to="/mot-de-passe-oublie"
                className="text-sm text-green-700 hover:underline"
              >
                Oublié ?
              </Link>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="motDePasse"
                placeholder="********"
                value={formData.motDePasse}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-200"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>

        </form>

        {/* FOOTER */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Pas de compte ?{" "}
          <Link to="/inscription" className="text-green-700 font-medium">
            S'inscrire
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;