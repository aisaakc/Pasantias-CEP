import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner'; // Importa Toaster de sonner
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Cursos from './pages/Cursos';
import Contacto from './pages/Contacto';

import Login from './pages/auth/Login';
import Registro from './pages/auth/Registro';

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/registro';

  if (isAuthPage) {
    // 🔒 Rutas que deben estar fuera del layout
    return (
      <div className="min-h-screen bg-gray-100"> {/* Fondo gris solo en Login y Registro */}
        <Toaster /> {/* Agrega el Toaster aquí */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-200">
      <Navbar />
      
      <main className="flex-grow pt-20 px-4 max-w-6xl mx-auto w-full">
        <Toaster /> {/* Agrega el Toaster aquí también, fuera de las rutas de autenticación */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/curso" element={<Cursos />} />
          <Route path="/contacto" element={<Contacto />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
