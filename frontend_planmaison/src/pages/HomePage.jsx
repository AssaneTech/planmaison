import React from "react";
import { Link } from "react-router-dom";
import { Home, MapPin, Hammer, CheckCircle, ArrowRight } from "lucide-react";

// Données fictives - Pour l'ingénieur Software : à remplacer par un fetch API vers Node.js plus tard
const services = [
  {
    icon: Home,
    title: "Conception Contemporaine",
    description:
      "Des plans modernes, lumineux et esthétiques, optimisés pour le confort de vie au Sénégal.",
  },
  {
    icon: MapPin,
    title: "Expertise Terrain Locale",
    description:
      "Plans rigoureusement adaptés aux dimensions et contraintes de votre parcelle (10x15, 10x20, angle...).",
  },
  {
    icon: Hammer,
    title: "Conformité Administrative",
    description:
      "Un dossier technique complet, certifié et prêt pour une obtention rapide de votre permis de construire.",
  },
];

const popularPlans = [
  { 
    image: "/plan-1.png", // Rendu 3D de haute qualité
    name: "Villa Moderne F4 Éco", 
    price: 450000, 
    surface: "150 m²" 
  },
  { 
    image: "/plan-2.png", 
    name: "Duplex Standing F5 Modern", 
    price: 650000, 
    surface: "220 m²" 
  },
  { 
    image: "/plan-3.png", 
    name: "Studio Compact Invest", 
    price: 250000, 
    surface: "45 m²" 
  },
];

const formatPrice = (price) =>
  new Intl.NumberFormat("fr-FR").format(price) + " FCFA";

const Index = () => {
  return (
    <div className="bg-white text-gray-900 min-h-screen">

      {/* --- HERO SECTION - FULL SCREEN & CHIC --- */}
      {/* On utilise min-h-screen pour occuper toute la hauteur, et le background image directement ici */}
      <section 
        className="relative min-h-screen flex items-center overflow-hidden bg-gray-950 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/hero.png')" }} // L'image occupe tout le fond
      >
        {/* Overlay : Dégradé subtil pour la lisibilité du texte blanc sur l'image */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/90 via-indigo-950/50 to-transparent z-10"></div>

        {/* Contenu du Hero - Centré verticalement et aligné à gauche */}
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-32 w-full relative z-20">
          <div className="max-w-4xl flex flex-col items-center md:items-start text-center md:text-left">
            
            {/* Badge de réassurance élégant (Adapté au fond sombre) */}
            <div className="mb-8 inline-flex items-center gap-2.5 rounded-full 
            bg-white/10 backdrop-blur-md px-5 py-2 text-sm font-semibold text-indigo-100 border border-white/10 shadow-inner">
              <CheckCircle size={18} />
              La plateforme de référence pour vos plans au Sénégal
            </div>

            {/* Titre Géant et Premium (Blanc) */}
            <h1 className="text-6xl md:text-8xl font-extrabold leading-tight text-white tracking-tight mb-7">
              Construisez votre<br /> maison avec <span className="text-indigo-400">confiance</span>.
            </h1>

            {/* Description (Blanche, font-light) */}
            <p className="text-2xl text-indigo-100 max-w-3xl font-light leading-relaxed mb-16">
              Téléchargez des plans architecturaux modernes, personnalisés à votre nom et certifiés par nos ingénieurs civils, prêts pour l'autorisation de construire partout au Sénégal.
            </p>

            {/* Boutons d'action (Pills, adaptés au fond sombre) */}
            <div className="flex flex-wrap gap-6 justify-center md:justify-start">
              <Link
                to="/catalogue"
                className="bg-white text-indigo-700 px-12 py-5 rounded-full 
                font-bold shadow-2xl hover:bg-gray-100 transition duration-300 transform hover:-translate-y-1 text-xl flex items-center space-x-2.5"
              >
                <span>Explorer le catalogue</span>
                <ArrowRight size={20} />
              </Link>

              <Link
                to="/sur-mesure"
                className="border-2 border-white text-white font-semibold 
                px-12 py-5 rounded-full hover:bg-white/10 transition duration-300 text-xl transform hover:-translate-y-1"
              >
                Plan sur-mesure
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- Le reste de la page (Services, Plans Populaires) reste inchangé --- */}
      
      {/* SERVICES - Design "Card" Premium */}
      <section className="py-28 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-extrabold text-gray-950 tracking-tight leading-tight">
            L'expertise technique <span className="text-indigo-600">PlanMaison</span>
          </h2>
          <p className="mt-6 text-lg text-gray-600 font-light max-w-xl mx-auto leading-relaxed">
            Une solution digitale rigoureuse pour concrétiser votre projet de construction en toute sérénité.
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-3">
          {services.map((s) => (
            <div
              key={s.title}
              className="group rounded-3xl bg-white border border-gray-100 
              p-10 text-center shadow-sm hover:shadow-2xl 
              transition duration-500 ease-out transform hover:-translate-y-3"
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center 
              rounded-full bg-indigo-50 text-indigo-600 
              group-hover:bg-indigo-600 group-hover:text-white transition duration-300 shadow-inner">
                <s.icon size={36} />
              </div>

              <h3 className="mt-8 text-2xl font-bold text-gray-950 tracking-tight">{s.title}</h3>
              <p className="mt-4 text-gray-600 text-base font-light leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* POPULAR PLANS - Design E-commerce Premium */}
      <section className="bg-gray-50 py-28 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-20 border-b border-gray-100 pb-12">
            <h2 className="text-4xl font-extrabold text-gray-950 tracking-tight leading-tight">Plans les plus plébiscités</h2>
            <p className="mt-6 text-lg text-gray-600 font-light max-w-xl mx-auto leading-relaxed">
              Découvrez les modèles architecturaux les plus choisis par nos clients pour leur qualité et leur fonctionnalité.
            </p>
          </div>

          <div className="grid gap-12 md:grid-cols-3">
            {popularPlans.map((plan) => (
              <div
                key={plan.name}
                className="group bg-white rounded-3xl overflow-hidden 
                shadow-sm border border-gray-100 hover:shadow-2xl transition duration-500 transform hover:-translate-y-2"
              >
                {/* Image du plan (Rendu 3D) - Forcer aspect ratio pour alignement */}
                <div className="aspect-w-16 aspect-h-11 overflow-hidden bg-gray-100">
                  <img
                    src={plan.image}
                    alt={plan.name}
                    className="w-full h-full object-cover 
                    group-hover:scale-105 transition-transform duration-700 ease-in-out"
                  />
                </div>

                {/* Contenu de la Card */}
                <div className="p-8 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-950 mb-1 group-hover:text-indigo-600 transition">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-6 font-light">Surface : {plan.surface} - Pack d'Autorisation Complet</p>

                  <p className="text-indigo-600 font-extrabold text-2xl mb-8">
                    {formatPrice(plan.price)}
                  </p>

                  {/* Bouton Pill */}
                  <Link
                    to="/catalogue"
                    className="block text-center bg-indigo-600 text-white 
                    px-6 py-4 rounded-full font-semibold hover:bg-indigo-700 transition duration-300 shadow-md hover:shadow-indigo-100 mt-auto"
                  >
                    Voir le plan complet
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Lien vers le catalogue */}
          <div className="mt-20 text-center">
            <Link
              to="/catalogue"
              className="inline-flex items-center space-x-2 border-2 border-indigo-600 
              text-indigo-600 px-10 py-4 rounded-full font-semibold 
              hover:bg-indigo-50 transition duration-300 transform hover:-translate-y-1 text-lg"
            >
              <span>Voir tout le catalogue d'autorisation</span>
              <ArrowRight size={18} />
            </Link>
          </div>

        </div>
      </section>

        {/* Section optionnelle : "Plans Sur-Mesure" (Contrastée) */}
        <div className="bg-indigo-700 py-16 px-4 md:px-8 shadow-2xl">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-8">
                <div className="max-w-3xl">
                    <h3 className="text-3xl font-bold text-white mb-3">Besoin d'un plan unique ?</h3>
                    <p className="text-indigo-100 text-lg font-light leading-relaxed">Nos ingénieurs civils dessinent votre maison sur-mesure pour s'adapter parfaitement à votre terrain et vos besoins spécifiques. Contactez-nous pour une étude personnalisée.</p>
                </div>
                <Link to="/sur-mesure" className="bg-white text-indigo-700 font-bold px-10 py-4 rounded-full text-lg hover:bg-indigo-50 transition duration-300 transform hover:scale-105 shadow-xl">
                    Demander un devis d'ingénierie
                </Link>
            </div>
        </div>

    </div>
  );
};

export default Index;