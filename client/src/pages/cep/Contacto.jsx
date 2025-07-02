import { useState } from 'react';
// import Mapa from '../../components/Mapa';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';

export default function Contacto() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleInputChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Formulario enviado!');
  };

  const contactos = [
    {
      icon: <FaEnvelope className="text-indigo-600 text-2xl" />,
      title: 'Email',
      text: 'contacto@cep.org',
    },
    {
      icon: <FaPhoneAlt className="text-indigo-600 text-2xl" />,
      title: 'Teléfono',
      text: '+58 424-1234567',
    },
    {
      icon: <FaMapMarkerAlt className="text-indigo-600 text-2xl" />,
      title: 'Dirección',
      text: 'Calle Real de los Flores de Catia con calle Andrés Bello, Edif. Jesús Obrero, Los Flores de Catia, Parroquia Sucre, Distrito Capital, Caracas 1030.',
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 bg-gradient-to-b from-gray-50 to-white">
      {/* Título con efecto de gradiente */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-4 animate-fadeIn">
          Contacto
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto rounded-full"></div>
      </div>

      {/* Descripción */}
      <p className="text-lg text-center text-gray-600 mb-16 animate-fadeIn delay-100 max-w-2xl mx-auto">
        Ponte en contacto con nosotros a través de los siguientes medios o completa el formulario.
      </p>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        {/* Información de contacto */}
        <div className="space-y-6">
          {contactos.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start space-x-6 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="shrink-0 p-3 bg-indigo-50 rounded-xl">{item.icon}</div>
              <div>
                <p className="font-bold text-gray-800 text-lg mb-1">{item.title}</p>
                <p className="text-gray-600">{item.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-xl space-y-6 animate-fadeIn delay-150 border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Envíanos tu mensaje</h2>

          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
              Nombre
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={form.name}
              onChange={handleInputChange}
              placeholder="Tu nombre"
              required
              className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={form.email}
              onChange={handleInputChange}
              placeholder="Tu correo electrónico"
              required
              className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
              Mensaje
            </label>
            <textarea
              name="message"
              id="message"
              value={form.message}
              onChange={handleInputChange}
              placeholder="Escribe tu mensaje"
              required
              rows="4"
              className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition duration-300 transform hover:-translate-y-1 flex items-center justify-center space-x-2"
          >
            <span>Enviar Mensaje</span>
            <FaPaperPlane className="text-sm" />
          </button>
        </form>
      </div>

      {/* Mapa */}
      {/* <div className="max-w-5xl mx-auto mt-16 animate-fadeIn delay-200">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Ubicación</h2>
        <div className=" top-24 relative w-full h-[500px] rounded-2xl overflow-hidden shadow-2xl z-0">
          <Mapa />
        </div>
      </div> */}
    </div>
  );
}
