import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Zap,
  CheckCircle,
  ArrowLeft,
  Loader2,
  CreditCard,
  Smartphone
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import dotenv from "dotenv";

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

  // ================================
  // 🔍 CHECK EMAIL (DEBOUNCE + SAFE)
  // ================================
  useEffect(() => {
    if (!formData.email || !formData.email.includes("@")) return;

    const timeout = setTimeout(() => {
      checkUserStatus(formData.email);
    }, 600);

    return () => clearTimeout(timeout);
  }, [formData.email]);

  const checkUserStatus = async (email) => {
    try {
      setCheckingEmail(true);

      const res = await fetch(
        `${API_URL}/users/check-email?email=${encodeURIComponent(email)}`
      );

      if (!res.ok) {
        console.error("Erreur API check-email");
        return;
      }

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

  // ================================
  // 📝 INPUT CHANGE
  // ================================
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ================================
  // ➡️ STEP 2
  // ================================
  const goToPayment = (e) => {
    e.preventDefault();

    if (!formData.nom || !formData.email || !formData.telephone) {
      return toast.error("Remplissez tous les champs");
    }

    if (!formData.paiement) {
      return toast.error("Choisissez un mode de paiement");
    }

    setStep(2);
  };

  // ================================
  // 💳 FINALISATION
  // ================================
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
          plan,
          client: formData
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur serveur");
      }

      setStep(3);

      setTimeout(() => {
        navigate("/mes-plans");
      }, 4000);

    } catch (err) {
      console.error("Erreur complète:", err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // ❌ SI PLAN ABSENT
  // ================================
  if (!plan) {
    return (
      <div className="p-20 text-center font-bold">
        Plan introuvable...
      </div>
    );
  }

  // ================================
  // 🎨 UI
  // ================================
  return (
    <div className="bg-[#F8FAFC] min-h-screen pt-32 pb-20 px-4 font-sans">
      <Toaster position="top-right" />

      <div className="max-w-6xl mx-auto">

        {/* RETOUR */}
        {step < 3 && (
          <button
            onClick={() =>
              step === 1 ? navigate(-1) : setStep(1)
            }
            className="flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-green-700 uppercase tracking-widest mb-10"
          >
            <ArrowLeft size={14} />
            {step === 1 ? "Retour" : "Modifier mes infos"}
          </button>
        )}

        {/* ========================= */}
        {/* ÉTAPE 1 */}
        {/* ========================= */}
        {step === 1 && (
          <div className="grid lg:grid-cols-5 gap-12">

            {/* RÉSUMÉ */}
            <div className="lg:col-span-2">
              <div className="bg-white p-8 rounded-[2rem] shadow-sm">
                <img
                  src={plan.images?.[0]}
                  alt={plan.name}
                  className="w-full aspect-video object-cover rounded-xl mb-6"
                />
                <h4 className="font-black text-lg">{plan.name}</h4>

                <div className="mt-6 flex justify-between">
                  <span>Total</span>
                  <span className="font-bold text-green-700">
                    {plan.price} FCFA
                  </span>
                </div>
              </div>
            </div>

            {/* FORM */}
            <form
              onSubmit={goToPayment}
              className="lg:col-span-3 bg-white p-8 rounded-[2rem] shadow-sm space-y-6"
            >
              <input
                type="text"
                name="nom"
                placeholder="Nom complet"
                required
                onChange={handleChange}
                className="w-full p-4 bg-gray-50 rounded-xl"
              />

              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  onChange={handleChange}
                  className="w-full p-4 bg-gray-50 rounded-xl"
                />

                {/* STATUS EMAIL */}
                {formData.email && (
                  <p className="text-xs mt-2">
                    {checkingEmail
                      ? "Vérification..."
                      : emailExists
                      ? "✔ Compte existant"
                      : "➕ Nouveau client"}
                  </p>
                )}
              </div>

              <input
                type="tel"
                name="telephone"
                placeholder="Téléphone"
                required
                onChange={handleChange}
                className="w-full p-4 bg-gray-50 rounded-xl"
              />

              {/* PAIEMENT */}
              <div className="grid grid-cols-3 gap-3">
                {["wave", "orange-money", "carte"].map((m) => (
                  <label
                    key={m}
                    className={`p-4 rounded-xl text-center cursor-pointer border ${
                      formData.paiement === m
                        ? "border-green-600 bg-green-50"
                        : "bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paiement"
                      value={m}
                      onChange={handleChange}
                      className="hidden"
                    />
                    {m}
                  </label>
                ))}
              </div>

              <button className="w-full bg-black text-white py-4 rounded-xl">
                Suivant
              </button>
            </form>
          </div>
        )}

        {/* ========================= */}
        {/* ÉTAPE 2 */}
        {/* ========================= */}
        {step === 2 && (
          <div className="max-w-md mx-auto text-center space-y-6">
            <h2 className="text-xl font-bold">
              Paiement {formData.paiement}
            </h2>

            <p>{plan.price} FCFA</p>

            <button
              onClick={handleFinalize}
              disabled={loading}
              className="w-full bg-black text-white py-4 rounded-xl flex justify-center"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Confirmer"}
            </button>
          </div>
        )}

        {/* ========================= */}
        {/* ÉTAPE 3 */}
        {/* ========================= */}
        {step === 3 && (
          <div className="text-center space-y-6">
            <CheckCircle size={60} className="mx-auto text-green-600" />

            <h2 className="text-2xl font-bold">
              Commande réussie
            </h2>

            <p>
              Le plan a été envoyé à <b>{formData.email}</b>
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default FinaliserCommande;