import React, { useState } from "react";

const SurMesureContextuel = () => {
  const [formData, setFormData] = useState({
    nomComplet: "",
    telephone: "", // Crucial pour le Sénégal
    email: "",
    dimensionsTerrain: "",
    nombrePieces: "",
    descriptionProjet: "", // Zone de texte libre pour le style, budget, etc.
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Note pour l'Ingénieur Software : C'est ici que tu appelleras ton API Node.js
    // pour stocker cette demande spécifique de "Sur-Mesure depuis Catalogue".
    console.log("Demande de plan sur-mesure reçue du Catalogue:", formData);
    
    // Une fois envoyé, on peut rediriger vers une page de remerciement
    // navigate("/merci-demande-sur-mesure");
  };

  return (
    <div className="bg-white p-10 md:p-12 rounded-3xl shadow-xl border border-gray-100 max-w-4xl mx-auto my-16">
      
      {/* En-tête : Approche empathique et valorisation technique */}
      <div className="text-center mb-12 border-b border-gray-100 pb-10">
        <span className="text-5xl mb-4 block">✍️</span>
        <h2 className="text-4xl font-extrabold text-gray-950 mb-4 tracking-tight">
          Vous n'avez pas trouvé le <span className="text-indigo-600">plan idéal</span> ?
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
          Décrivez-nous votre projet en quelques lignes. Nos **ingénieurs civils** concevront un plan unique, parfaitement adapté à votre terrain et conforme aux normes d'autorisation de construire au Sénégal.
        </p>
      </div>

      {/* Le Formulaire Compact */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Section 1 : Coordonnées (Grille 2 colonnes) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1 md:col-span-2 relative">
            <input
              type="text"
              name="nomComplet"
              placeholder="Votre Nom Complet"
              value={formData.nomComplet}
              onChange={handleChange}
              required
              className="w-full pl-6 pr-6 py-4 rounded-full bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition duration-300 text-lg"
            />
          </div>
          
          <input
            type="tel"
            name="telephone"
            placeholder="Téléphone (Wave/Orange Money)"
            value={formData.telephone}
            onChange={handleChange}
            required
            className="w-full pl-6 pr-6 py-4 rounded-full bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition duration-300 text-lg"
          />
          
          <input
            type="email"
            name="email"
            placeholder="Adresse E-mail"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full pl-6 pr-6 py-4 rounded-full bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition duration-300 text-lg"
          />
        </div>

        {/* Section 2 : Informations Techniques de base (Grille 2 colonnes) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            name="dimensionsTerrain"
            placeholder="Dimensions du terrain (ex: 10m x 20m)"
            value={formData.dimensionsTerrain}
            onChange={handleChange}
            required
            className="w-full pl-6 pr-6 py-4 rounded-full bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition duration-300 text-lg"
          />
          
          <input
            type="number"
            name="nombrePieces"
            placeholder="Nombre de pièces souhaitées (ex: 5)"
            value={formData.nombrePieces}
            onChange={handleChange}
            required
            className="w-full pl-6 pr-6 py-4 rounded-full bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition duration-300 text-lg"
          />
        </div>

        {/* Section 3 : Description libre du projet */}
        <div className="relative">
          <textarea
            name="descriptionProjet"
            placeholder="Décrivez votre maison idéale : style (moderne, traditionnel), budget approximatif, besoins spéciaux (garage, bureau, piscine)..."
            value={formData.descriptionProjet}
            onChange={handleChange}
            rows="5"
            required
            className="w-full p-6 rounded-3xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition duration-300 text-lg leading-relaxed"
          />
        </div>

        {/* Bouton d'action principal */}
        <div className="text-center pt-4">
          <button
            type="submit"
            className="w-full md:w-auto bg-indigo-600 text-white font-bold px-12 py-5 rounded-full shadow-lg hover:bg-indigo-700 hover:shadow-indigo-100 transition duration-300 transform hover:scale-[1.03] text-xl flex items-center justify-center space-x-3 mx-auto"
          >
            <span>🛠️</span>
            <span>Demander mon étude sur-mesure</span>
          </button>
          <p className="text-xs text-gray-400 mt-5">
            Note : Nos ingénieurs civils analyseront votre demande et vous contacteront sous 48h pour un devis détaillé.
          </p>
        </div>

      </form>
    </div>
  );
};

export default SurMesureContextuel;
