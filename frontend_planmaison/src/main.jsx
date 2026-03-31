import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // fichier où Tailwind est importé
import { BrowserRouter } from "react-router-dom";

// Création de la racine React
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
     <App />
    </BrowserRouter>
  </React.StrictMode>
);
