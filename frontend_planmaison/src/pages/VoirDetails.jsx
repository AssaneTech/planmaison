import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000";

/* ================= IMAGE ZOOM ================= */
const ImageZoom = ({ src }) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const start = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // 🔥 BLOQUE SCROLL PAGE
  useEffect(() => {
    const container = containerRef.current;

    const handleWheel = (e) => {
      e.preventDefault();

      const newZoom = Math.min(Math.max(zoom + e.deltaY * -0.001, 1), 4);
      setZoom(newZoom);
    };

    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
    };
  }, [zoom]);

  // DRAG
  const handleMouseDown = (e) => {
    setDragging(true);
    start.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseUp = () => setDragging(false);

  const handleMouseMove = (e) => {
    if (!dragging || zoom <= 1) return;

    setPosition({
      x: e.clientX - start.current.x,
      y: e.clientY - start.current.y,
    });
  };

  const reset = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
      onDoubleClick={reset}
      className="w-full h-[420px] overflow-hidden rounded-2xl bg-gray-100 cursor-grab active:cursor-grabbing"
    >
      <img
        src={src}
        alt=""
        draggable={false}
        className="w-full h-full object-contain select-none"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
          transition: dragging ? "none" : "transform 0.2s ease",
        }}
      />
    </div>
  );
};

/* ================= PAGE ================= */
const VoirDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [plan, setPlan] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");

  // 🔥 FETCH BACKEND
  useEffect(() => {
    fetch(`${API_URL}/plans/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPlan(data);
        setSelectedImage(data.images?.[0]);
      })
      .catch((err) => console.error(err));
  }, [id]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("fr-FR").format(price) + " FCFA";

  const getLabel = (index) => {
    if (index === 0) return "Vue 3D";
    if (index === 1) return "RDC";
    return `Étage ${index - 1}`;
  };

  if (!plan) {
    return (
      <div className="text-center py-20 bg-gray-50 min-h-screen pt-28">
        Chargement...
      </div>
    );
  }

  const handleCommander = () => {
    navigate("/finaliser-commande", { state: { plan } });
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-28 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">

        {/* BREADCRUMB */}
        <nav className="mb-8 text-sm text-gray-500">
          <span onClick={() => navigate('/')} className="cursor-pointer hover:text-green-700">Accueil</span> / 
          <span onClick={() => navigate('/catalogue')} className="cursor-pointer hover:text-green-700"> Catalogue</span> / 
          <span className="text-gray-900 font-medium"> {plan.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-12">

          {/* IMAGES */}
          <div>
            <ImageZoom src={selectedImage} />

            {/* MINIATURES */}
            <div className="grid grid-cols-4 gap-3 mt-4  pt-4">
              {plan.images?.map((img, i) => (
                <div key={i} className="text-center">
                  <img
                    src={img}
                    onClick={() => setSelectedImage(img)}
                    className={`cursor-pointer w-full h-full object-cover rounded-lg border-2 ${
                      selectedImage === img
                        ? "border-green-700"
                        : "border-gray-200"
                    }`}
                  />
                  <p className="text-xs mt-1 text-gray-500">
                    {getLabel(i)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* INFOS */}
          <div className="bg-white p-8 rounded-2xl shadow flex flex-col">

            <h1 className="text-3xl font-bold mb-4">{plan.name}</h1>

            <p className="text-[#D4AF37] text-2xl font-bold mb-6">
              {formatPrice(plan.price)}
            </p>

            <p className="text-gray-600 mb-6">
              Plan conforme aux normes sénégalaises pour autorisation de construire.
            </p>

            {/* CARACTERISTIQUES */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-xl">📏 {plan.dimensions}</div>
              <div className="bg-gray-50 p-4 rounded-xl">📐 {plan.surface}</div>
              <div className="bg-gray-50 p-4 rounded-xl">🏗️ Standard</div>
              <div className="bg-gray-50 p-4 rounded-xl">📄 PDF HD</div>
            </div>

            {/* CTA */}
            <button
              onClick={handleCommander}
              className="bg-green-700 text-white py-4 rounded-xl font-bold hover:bg-green-600 transition"
            >
              Acheter ce plan
            </button>

            <p className="text-xs text-gray-400 text-center mt-3">
              Paiement sécurisé : Wave / Orange / Carte
            </p>

          </div>
        </div>

        {/* PACK */}
        <div className="mt-16 bg-white p-8 rounded-2xl shadow">
          <h2 className="text-xl font-bold mb-4">
            Contenu du pack
          </h2>

          <ul className="grid md:grid-cols-2 gap-3 text-gray-600">
            <li>✔ Plans RDC et étages</li>
            <li>✔ Façades</li>
            <li>✔ Coupes</li>
            <li>✔ Plan de masse</li>
            <li>✔ Assainissement</li>
            <li>✔ Note technique</li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default VoirDetails;