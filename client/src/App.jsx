import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Home from "./pages/cep/Home";
import Lista from "./pages/cep/Lista";
import Contacto from "./pages/cep/Contacto";
import Login from "./pages/auth/Login";
import Registro from "./pages/auth/Registro";
import Clasificacion from "./pages/dashboard/Clasificacion";
import Tipos from "./pages/dashboard/Tipos";
import Layout from "./components/Layout";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import { Toaster } from 'sonner';
import React from 'react';

export default function App() {
  const location = useLocation();

  const dashboardRoute = location.pathname.startsWith("/dashboard");

  return (
    <>
      <Toaster position="top-right" richColors expand={true} />

      {dashboardRoute ? (
        <Routes>
          <Route path="/dashboard" element={<Layout />}>
            <Route index element={<Clasificacion />} />
            <Route path="clasificacion" element={<Clasificacion />} />
            <Route path="tipos" element={<Tipos />} />
          </Route>
        </Routes>
      ) : (
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow mb-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/lista" element={<Lista />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/login" element={<Login redirectTo="/dashboard/clasificacion" />} /> 
              <Route path="/registro" element={<Registro />} />
            </Routes>
          </main>
          <Footer />
        </div>
      )}
    </>
  );
}

