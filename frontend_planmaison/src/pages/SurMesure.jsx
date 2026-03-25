import React, { useState } from "react";

const SurMesureContextuel = () => {
  const [formData, setFormData] = useState({
    nomComplet: "",
    telephone: "",
    email: "",
    dimensionsTerrain: "",
    nombrePieces: "",
    descriptionProjet: "",
    fichierTerrain: null,
  });

  const handleChange = (e) => {
    if (e.target.name === "fichierTerrain") {
      setFormData({ ...formData, fichierTerrain: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔥 Préparation pour backend
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    console.log("Demande envoyée :", formData);

    // Ici tu enverras vers ton backend
    // fetch("/api/sur-mesure", { method: "POST", body: data })
  };

  return (
    <div className="bg-white p-10 md:p-12 rounded-3xl shadow-xl border border-gray-100 max-w-4xl mx-auto my-16">

      {/* HEADER */}
      <div className="text-center mb-12 border-b pb-10">
        <h2 className="text-4xl font-extrabold mb-4">
          Plan <span className="text-green-700">sur mesure</span>
        </h2>

        <p className="text-gray-600 max-w-2xl mx-auto">
          Décrivez votre projet et joignez votre extrait de plan si disponible.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* INFOS */}
        <div className="grid md:grid-cols-2 gap-6">
          <input
            type="text"
            name="nomComplet"
            placeholder="Nom complet"
            required
            onChange={handleChange}
            className="input-style col-span-2"
          />

          <input
            type="tel"
            name="telephone"
            placeholder="Téléphone"
            required
            onChange={handleChange}
            className="input-style"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            onChange={handleChange}
            className="input-style"
          />
        </div>

        {/* TECHNIQUE */}
        <div className="grid md:grid-cols-2 gap-6">
          <input
            type="text"
            name="dimensionsTerrain"
            placeholder="Dimensions (ex: 10x20)"
            required
            onChange={handleChange}
            className="input-style"
          />

          <input
            type="number"
            name="nombrePieces"
            placeholder="Nombre de pièces"
            required
            onChange={handleChange}
            className="input-style"
          />
        </div>

        {/* DESCRIPTION */}
        <textarea
          name="descriptionProjet"
          placeholder="Décrivez votre projet..."
          rows="5"
          required
          onChange={handleChange}
          className="w-full p-5 rounded-2xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-200"
        />

        {/* 🔥 UPLOAD FICHIER */}
        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center bg-gray-50 hover:border-green-400 transition">
          <p className="text-gray-600 mb-2">
            📎 Joindre un extrait de plan (facultatif)
          </p>
          <p className="text-sm text-gray-400 mb-4">
            PDF, image ou capture de votre terrain
          </p>

          <input
            type="file"
            name="fichierTerrain"
            accept=".pdf,image/*"
            onChange={handleChange}
            className="block mx-auto text-sm"
          />

          {formData.fichierTerrain && (
            <p className="mt-3 text-green-700 text-sm">
              Fichier sélectionné : {formData.fichierTerrain.name}
            </p>
          )}
        </div>

        {/* BUTTON */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-green-700 text-white px-10 py-4 rounded-full font-bold hover:bg-green-600 transition"
          >
            Envoyer ma demande
          </button>

          <p className="text-xs text-gray-400 mt-4">
            Réponse sous 48h par nos ingénieurs
          </p>
        </div>
      </form>

      {/* STYLE */}
      <style jsx>{`
        .input-style {
          @apply w-full px-5 py-3 rounded-full border border-gray-200 bg-gray-50 
          focus:outline-none focus:ring-2 focus:ring-green-200 transition;
        }
      `}</style>
    </div>
  );
};

export default SurMesureContextuel;