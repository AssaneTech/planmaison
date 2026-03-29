import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  ShieldCheck, Smartphone, CreditCard, 
  User, Mail, Phone, Lock, Zap, CheckCircle, ArrowLeft 
} from "lucide-react";

const API_URL = "http://localhost:5000";

const FinaliserCommande = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const plan = location.state?.plan || null;

  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    paiement: "",
  });

  const [emailExists, setEmailExists] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);

  // Vérification de l'email en temps réel (Debounce pour ne pas surcharger l'API)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (formData.email && formData.email.includes("@")) {
        checkUserStatus(formData.email);
      }
    }, 600);

    return () => clearTimeout(delayDebounceFn);
  }, [formData.email]);

  const checkUserStatus = async (email) => {
    setCheckingEmail(true);
    try {
      const res = await fetch(`${API_URL}/users/check-email?email=${email}`);
      const data = await res.json();
      setEmailExists(data.exists); // Suppose que ton API renvoie { exists: true/false }
    } catch (err) {
      console.error("Erreur check email");
    } finally {
      setCheckingEmail(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("fr-FR").format(price) + " FCFA";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.paiement) {
      alert("Veuillez choisir une méthode de paiement");
      return;
    }

    const stateData = { 
        plan, 
        client: formData,
        isNewUser: !emailExists // Information cruciale pour le backend
    };
    
    const routes = {
      "wave": "/paiement-wave",
      "orange-money": "/paiement-orange",
      "carte": "/paiement-carte"
    };

    navigate(routes[formData.paiement], { state: stateData });
  };

  if (!plan) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <button onClick={() => navigate('/catalogue')} className="bg-black text-white px-8 py-4 rounded-2xl font-bold uppercase text-xs tracking-widest">
            Retour au catalogue
        </button>
    </div>
  );

  return (
    <div className="bg-[#F8FAFC] min-h-screen pt-32 pb-20 px-4 md:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-green-700 uppercase tracking-widest mb-10 transition-colors">
          <ArrowLeft size={14} /> Retour
        </button>

        <div className="grid lg:grid-cols-5 gap-12">
          
          {/* COLONNE GAUCHE : RÉSUMÉ DU PANIER */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <h3 className="text-xl font-black text-gray-900 mb-6 uppercase italic tracking-tighter text-center">Votre Plan</h3>
              <div className="aspect-video rounded-[1.5rem] overflow-hidden mb-6 bg-gray-50">
                <img src={plan.images?.[0]} alt={plan.name} className="w-full h-full object-cover transition-transform hover:scale-105 duration-700" />
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-gray-950 text-lg uppercase leading-tight italic">{plan.name}</h4>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">{plan.surface} • {plan.dimensions}</p>
              </div>
              <div className="mt-8 pt-8 border-t border-gray-50 flex justify-between items-center">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total à régler</span>
                <span className="text-3xl font-black text-green-700 tracking-tighter italic">{formatPrice(plan.price)}</span>
              </div>
            </div>

            <div className="bg-gray-900 p-6 rounded-[2rem] text-white flex items-center gap-4 shadow-xl shadow-gray-200">
               <ShieldCheck className="text-green-500" size={32} />
               <p className="text-[9px] font-bold uppercase tracking-tight leading-relaxed opacity-80">
                 Dossier complet conforme aux normes sénégalaises. Envoi immédiat par Email après confirmation.
               </p>
            </div>
          </div>

          {/* COLONNE DROITE : FORMULAIRE DE PAIEMENT INTELLIGENT */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-[3rem] border border-gray-100 shadow-sm space-y-10">
              
              {/* SECTION IDENTITÉ */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <span className="bg-gray-100 text-gray-950 w-8 h-8 rounded-full flex items-center justify-center font-black text-xs italic">01</span>
                    <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em]">Informations Personnelles</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-green-700 transition-colors" size={16} />
                    <input type="text" name="nom" placeholder="NOM COMPLET" required onChange={handleChange}
                      className="w-full pl-12 pr-4 py-5 bg-gray-50 border-none rounded-2xl text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-green-100 transition-all placeholder:text-gray-300" />
                  </div>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-green-700 transition-colors" size={16} />
                    <input type="tel" name="telephone" placeholder="TÉLÉPHONE (WAVE/OM)" required onChange={handleChange}
                      className="w-full pl-12 pr-4 py-5 bg-gray-50 border-none rounded-2xl text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-green-100 transition-all placeholder:text-gray-300" />
                  </div>
                </div>

                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-green-700 transition-colors" size={16} />
                  <input type="email" name="email" placeholder="ADRESSE EMAIL DE RÉCEPTION" required onChange={handleChange}
                    className="w-full pl-12 pr-4 py-5 bg-gray-50 border-none rounded-2xl text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-green-100 transition-all placeholder:text-gray-300" />
                </div>

                {/* BANDEAU DYNAMIQUE (LE COEUR DE TA LOGIQUE) */}
                <div className={`mt-6 flex items-start gap-4 p-5 rounded-[1.5rem] border transition-all duration-500 ${
                  emailExists ? "bg-green-50 border-green-100" : "bg-blue-50 border-blue-100"
                }`}>
                  <div className={`p-2 rounded-xl text-white ${emailExists ? "bg-green-600" : "bg-blue-600"}`}>
                    {emailExists ? <CheckCircle size={16} /> : <Zap size={16} />}
                  </div>
                  <div>
                    <h5 className={`text-[10px] font-black uppercase tracking-widest ${emailExists ? "text-green-700" : "text-blue-700"}`}>
                        {emailExists ? "Utilisateur reconnu" : "Création de compte automatique"}
                    </h5>
                    <p className={`text-[9px] font-bold mt-1 leading-relaxed uppercase tracking-tight ${emailExists ? "text-green-600" : "text-blue-600"}`}>
                        {emailExists 
                            ? "Ravi de vous revoir ! Ce plan sera ajouté directement à votre espace membre habituel."
                            : "Nouveau client ? Vos accès (email + mot de passe généré) vous seront envoyés par mail avec votre plan."
                        }
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION PAIEMENT */}
              <div className="space-y-6 pt-4 border-t border-gray-50">
                <div className="flex items-center gap-4">
                    <span className="bg-gray-100 text-gray-950 w-8 h-8 rounded-full flex items-center justify-center font-black text-xs italic">02</span>
                    <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em]">Mode de règlement</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: "wave", label: "Wave", color: "blue" },
                    { id: "orange-money", label: "Orange", color: "orange" },
                    { id: "carte", label: "Carte", color: "gray" }
                  ].map((method) => (
                    <label key={method.id} className={`relative flex flex-col items-center justify-center p-6 border-2 rounded-[2rem] cursor-pointer transition-all duration-300 ${
                        formData.paiement === method.id 
                        ? "border-green-600 bg-green-50/30 scale-105 shadow-lg shadow-green-100" 
                        : "border-gray-50 bg-gray-50 hover:border-gray-200"
                    }`}>
                        <input type="radio" name="paiement" value={method.id} className="hidden" onChange={handleChange} />
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 text-white font-black text-lg ${
                            method.id === "wave" ? "bg-blue-500" : method.id === "orange-money" ? "bg-orange-500" : "bg-gray-900"
                        }`}>
                           {method.id === "carte" ? <CreditCard size={18} /> : method.label[0]}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-tighter">{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* BOUTON FINAL */}
              <button type="submit" className="w-full bg-gray-950 text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-green-700 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-2xl shadow-gray-200">
                <Zap size={18} /> Confirmer et Payer
              </button>

              <p className="text-center text-[8px] font-black text-gray-300 uppercase tracking-[0.3em]">
                Transactions sécurisées par protocole SSL/TLS
              </p>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FinaliserCommande;