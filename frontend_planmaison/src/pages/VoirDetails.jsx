import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Maximize, Bed, Bath, FileText,
  CheckCircle, ArrowLeft, ShoppingCart, Layers
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

/* ================= IMAGE ZOOM ================= */
const ImageZoom = ({ src }) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const start = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;

    const handleWheel = (e) => {
      e.preventDefault();
      const newZoom = Math.min(Math.max(zoom + e.deltaY * -0.001, 1), 4);
      setZoom(newZoom);
    };

    if (el) el.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      if (el) el.removeEventListener("wheel", handleWheel);
    };
  }, [zoom]);

  const handleMouseDown = (e) => {
    setDragging(true);
    start.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  const handleMouseUp = () => setDragging(false);

  const handleMouseMove = (e) => {
    if (!dragging || zoom <= 1) return;
    setPosition({
      x: e.clientX - start.current.x,
      y: e.clientY - start.current.y
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
      className="w-full h-[450px] bg-white rounded-3xl overflow-hidden border cursor-grab"
    >
      <img
        src={src || "/placeholder.png"}
        alt="plan"
        draggable={false}
        className="w-full h-full object-contain p-4"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
          transition: dragging ? "none" : "transform 0.3s"
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= FETCH PLAN =================
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await fetch(`${API_URL}/plans/${id}`);

        if (!res.ok) {
          throw new Error("Plan introuvable");
        }

        const data = await res.json();

        setPlan(data);
        setSelectedImage(data.images?.[0] || "");
      } catch (err) {
        console.error(err);
        setError("Impossible de charger ce plan");
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [id]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("fr-FR").format(price || 0) + " FCFA";

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Chargement...
      </div>
    );
  }

  // ================= ERROR =================
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-500 font-bold">{error}</p>
        <button onClick={() => navigate("/catalogue")} className="text-blue-500">
          Retour
        </button>
      </div>
    );
  }

  // ================= NO PLAN =================
  if (!plan) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Plan introuvable
      </div>
    );
  }

  // ================= UI =================
  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4 md:px-8 pb-20">
      <div className="max-w-7xl mx-auto">

        {/* BACK */}
        <button
          onClick={() => navigate("/catalogue")}
          className="mb-6 flex items-center gap-2 text-gray-500 hover:text-green-600"
        >
          <ArrowLeft size={16} /> Retour
        </button>

        <div className="grid md:grid-cols-2 gap-10">

          {/* LEFT */}
          <div>
            <ImageZoom src={selectedImage} />

            {/* THUMBNAILS */}
            <div className="flex gap-3 mt-4 flex-wrap">
              {plan.images?.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt=""
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 object-cover rounded-xl cursor-pointer border ${
                    selectedImage === img ? "border-green-600" : ""
                  }`}
                />
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="bg-white p-8 rounded-3xl shadow">

            <h1 className="text-2xl font-bold mb-4">
              {plan.name}
            </h1>

            <p className="text-green-600 text-xl font-bold mb-6">
              {formatPrice(plan.price)}
            </p>

            {/* INFOS */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex gap-2 items-center">
                <Maximize size={16} />
                <span>{plan.surface || "N/A"}</span>
              </div>

              <div className="flex gap-2 items-center">
                <Layers size={16} />
                <span>{plan.dimensions || "N/A"}</span>
              </div>

              <div className="flex gap-2 items-center">
                <Bed size={16} />
                <span>{plan.rooms || 0} chambres</span>
              </div>

              <div className="flex gap-2 items-center">
                <Bath size={16} />
                <span>{plan.bathrooms || 0} sdb</span>
              </div>
            </div>

            {/* DESCRIPTION */}
            <p className="text-gray-500 mb-6">
              {plan.description || "Description non disponible"}
            </p>

            {/* CTA */}
            <button
              onClick={() =>
                navigate("/finaliser-commande", { state: { plan } })
              }
              className="w-full bg-black text-white py-4 rounded-xl hover:bg-green-700 flex items-center justify-center gap-2"
            >
              <ShoppingCart size={16} /> Acheter
            </button>

            <div className="text-xs text-gray-400 mt-4 flex items-center gap-2">
              <CheckCircle size={14} /> Téléchargement immédiat
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default VoirDetails;