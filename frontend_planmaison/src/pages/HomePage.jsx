import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Home, MapPin, Hammer, CheckCircle, ArrowRight } from "lucide-react";

const services = [
  {
    icon: Home,
    title: "Conception Contemporaine",
    description:
      "Des plans modernes et optimisés pour le confort de vie au Sénégal.",
  },
  {
    icon: MapPin,
    title: "Adapté à votre terrain",
    description:
      "Plans conçus pour 10x15, 10x20, angle et toutes configurations.",
  },
  {
    icon: Hammer,
    title: "Prêt pour autorisation",
    description:
      "Dossier complet conforme aux exigences administratives.",
  },
];

const Index = () => {

  useEffect(() => {
    document.title = "PlanMaison.sn - Plans de maison au Sénégal";
  }, []);

  return (
    <div className="bg-white text-gray-900">

      {/* HERO */}
      <section
        className="relative min-h-screen flex items-center bg-cover bg-center"
        style={{ backgroundImage: "url('/hero.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 via-green-900/60 to-transparent" />

        <div className="max-w-7xl mx-auto px-6 py-32 relative z-10">
          <div className="max-w-3xl">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full 
            bg-white/10 backdrop-blur-md px-4 py-2 text-sm text-white border border-white/20">
              <CheckCircle size={16} />
              Plateforme de plans au Sénégal
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
              Construisez avec <span className="text-[#D4AF37]">confiance</span>
            </h1>

            <p className="text-lg text-gray-200 mb-10">
              Des plans modernes, personnalisés et prêts pour autorisation de construire.
            </p>

            <div className="flex gap-4 flex-wrap">
              <Link
                to="/catalogue"
                className="bg-green-700 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-600 flex items-center gap-2"
              >
                Explorer le catalogue
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/sur-mesure"
                className="border border-white text-white px-8 py-3 rounded-full hover:bg-white/10"
              >
                Plan sur mesure
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-24 px-6 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">
          Pourquoi choisir <span className="text-green-700">PlanMaison</span> ?
        </h2>

        <div className="grid md:grid-cols-3 gap-10 mt-12">
          {services.map((s) => (
            <div key={s.title} className="p-8 bg-white border rounded-2xl shadow-sm hover:shadow-xl transition">
              <div className="mx-auto w-16 h-16 flex items-center justify-center bg-green-100 rounded-full text-green-700">
                <s.icon size={28} />
              </div>

              <h3 className="mt-6 font-semibold text-lg">{s.title}</h3>
              <p className="text-gray-600 text-sm mt-3">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION CTA CATALOGUE */}
      <section className="bg-gray-50 py-20 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Explorez nos plans disponibles
        </h2>

        <p className="text-gray-600 mb-8 max-w-xl mx-auto">
          Parcourez notre catalogue de plans adaptés aux réalités du Sénégal et trouvez celui qui correspond à votre terrain.
        </p>

        <Link
          to="/catalogue"
          className="bg-green-700 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-600"
        >
          Voir le catalogue
        </Link>
      </section>

      {/* CTA FINAL */}
      <section className="bg-green-800 py-16 text-center text-white px-6">
        <h3 className="text-2xl font-bold mb-4">
          Besoin d’un plan sur mesure ?
        </h3>

        <p className="mb-6 text-green-100">
          Nos ingénieurs conçoivent votre projet selon votre terrain.
        </p>

        <Link
          to="/sur-mesure"
          className="bg-[#D4AF37] text-black px-8 py-3 rounded-full font-semibold hover:opacity-90"
        >
          Demander un plan
        </Link>
      </section>

    </div>
  );
};

export default Index;