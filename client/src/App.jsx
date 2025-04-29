import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/cep/Home";
import Lista from "./pages/cep/Lista";
import Contacto from "./pages/cep/Contacto";
import Login from "./pages/auth/Login";
import Registro from "./pages/auth/Registro";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import { Toaster, toast } from 'sonner'; // ✅


export default function App() {
  const location = useLocation();

  const hideLayout = ["/login", "/registro"].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {!hideLayout && <Navbar />}

  <Toaster position="top-right" richColors expand={true} />
      <main className="flex-grow mb-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lista" element={<Lista />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
        </Routes>
      </main>

      {!hideLayout && <Footer />}
    </div>
  );
}
