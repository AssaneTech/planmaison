import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

const FinaliserCommande = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const plan = location.state?.plan || null;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);

  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    paiement: ""
  });

  // =========================
  // ❌ REDIRECTION SI PAS DE PLAN
  // =========================
  useEffect(() => {
    if (!plan) {
      navigate("/catalogue");
    }
  }, [plan, navigate]);

  // =========================
  // 🔍 CHECK EMAIL (DEBOUNCE)
  // =========================
  useEffect(() => {
    if (!formData.email || !formData.email.includes("@")) return;

    const timeout = setTimeout(() => {
      checkEmail(formData.email);
    }, 500);

    return () => clearTimeout(timeout);
  }, [formData.email]);

  const checkEmail = async (email) => {
    try {
      setCheckingEmail(true);

      const res = await fetch(
        `${API_URL}/users/check-email?email=${encodeURIComponent(email)}`
      );

      if (!res.ok) return;

      const data = await res.json();

      if (typeof data.exists === "boolean") {
        setEmailExists(data.exists);
      }
    } catch (err) {
      console.error("Erreur check email:", err);
    } finally {
      setCheckingEmail(false);
    }
  };

  // =========================
  // 📝 INPUT
  // =========================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // =========================
  // ➡️ STEP 2
  // =========================
  const goToStep2 = (e) => {
    e.preventDefault();

    if (!formData.nom || !formData.email || !formData.telephone) {
      return toast.error("Remplissez tous les champs");
    }

    if (!formData.paiement) {
      return toast.error("Choisissez un mode de paiement");
    }

    setStep(2);
  };

  // =========================
  // 💳 FINALISATION (CORRIGÉE)
  // =========================
  const handleFinalize = async () => {
    if (!plan?._id) {
      return toast.error("Plan invalide");
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/orders/finalize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          // ✅ CORRECTION ICI
          plan: { _id: plan._id },
          client: formData
        })
      });

      const text = await res.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error("Réponse non JSON :", text);
        throw new Error("Réponse serveur invalide");
      }

      if (!res.ok) {
        throw new Error(data.error || "Erreur serveur");
      }

      toast.success("Commande réussie !");
      setStep(3);

      setTimeout(() => {
        navigate("/catalogue");
      }, 4000);

    } catch (err) {
      console.error("Erreur finalize:", err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4 pb-20">
      <Toaster position="top-right" />

      <div className="max-w-5xl mx-auto">

        {/* RETOUR */}
        {step < 3 && (
          <button
            onClick={() => (step === 1 ? navigate(-1) : setStep(1))}
            className="flex items-center gap-2 mb-6 text-gray-500 hover:text-green-600"
          >
            <ArrowLeft size={16} /> Retour
          </button>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <div className="grid md:grid-cols-2 gap-10">

            {/* PLAN */}
            <div className="bg-white p-6 rounded-2xl shadow">
              <img
                src={plan?.images?.[0] || "/placeholder.png"}
                alt=""
                className="w-full h-48 object-cover rounded-xl mb-4"
              />
              <h3 className="font-bold">{plan?.name}</h3>
              <p className="text-green-600 font-bold mt-2">
                {plan?.price} FCFA
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={goToStep2} className="bg-white p-6 rounded-2xl shadow space-y-4">

              <input
                type="text"
                name="nom"
                placeholder="Nom complet"
                onChange={handleChange}
                required
                className="w-full p-3 border rounded"
              />

              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded"
                />

                <p className="text-xs mt-1 text-gray-400">
                  {checkingEmail
                    ? "Vérification..."
                    : formData.email
                    ? emailExists
                      ? "✔ Compte existant"
                      : "➕ Nouveau client"
                    : ""}
                </p>
              </div>

              <input
                type="tel"
                name="telephone"
                placeholder="Téléphone"
                onChange={handleChange}
                required
                className="w-full p-3 border rounded"
              />

              {/* PAIEMENT */}
              <div className="grid grid-cols-3 gap-3">
                {["wave", "orange-money", "carte"].map((p) => (
                  <label
                    key={p}
                    className={`p-3 text-center rounded cursor-pointer border ${
                      formData.paiement === p
                        ? "bg-green-100 border-green-600"
                        : "bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paiement"
                      value={p}
                      onChange={handleChange}
                      className="hidden"
                    />
                    {p}
                  </label>
                ))}
              </div>

              <button className="w-full bg-black text-white py-3 rounded">
                Continuer
              </button>
            </form>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="max-w-md mx-auto text-center space-y-6">
            <h2 className="text-xl font-bold">Confirmer paiement</h2>

            <p className="text-lg">{plan.price} FCFA</p>

            <button
              onClick={handleFinalize}
              disabled={loading}
              className="w-full bg-black text-white py-4 rounded flex justify-center"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Confirmer"}
            </button>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="text-center space-y-4">
            <CheckCircle size={60} className="mx-auto text-green-600" />
            <h2 className="text-2xl font-bold">Commande réussie</h2>
            <p>Votre plan a été envoyé à {formData.email}</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default FinaliserCommande;