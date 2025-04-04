import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Cursos from './pages/Cursos';
import Contacto from './pages/Contacto';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      
      <main className="flex-grow pt-20 px-4 max-w-6xl mx-auto">
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
