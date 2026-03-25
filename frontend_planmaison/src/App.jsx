import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import Catalogue from "./pages/Catalogue";
import SurMesure from "./pages/SurMesure";
import Login from "./pages/Login";
import VoirDetails from "./pages/VoirDetails";
import FinaliserCommande from "./pages/FinaliserCommande";
import PaiementWave from "./pages/PaiementWave";
import PaiementOrange from "./pages/PaiementOrange";
import PaiementCarte from "./pages/PaiementCarte";
import CommandeSucces from "./pages/CommandeSucces";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="p-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalogue" element={<Catalogue />} />
            <Route path="/sur-mesure" element={<SurMesure />} />
            <Route path="/login" element={<Login/>} />
            <Route path="/details/:id" element={<VoirDetails/>}/>
            <Route path="/finaliser-commande" element ={<FinaliserCommande/>}/>
            <Route path="/paiement-wave" element ={<PaiementWave/>}/>
            <Route path="/paiement-orange" element ={<PaiementOrange/>}/>
            <Route path="/paiement-carte" element ={<PaiementCarte/>}/>
            <Route path="/commande-succes" element ={<CommandeSucces/>}/>
           
          </Routes>
        </main>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;
