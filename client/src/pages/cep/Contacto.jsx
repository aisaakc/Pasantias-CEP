import { useState } from 'react';
import Mapa from '../../components/Mapa';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';

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
      icon: <FaEnvelope className="text-indigo-600 text-xl mt-1" />,
      title: 'Email',
      text: 'contacto@cep.org',
    },
    {
      icon: <FaPhoneAlt className="text-indigo-600 text-xl mt-1" />,
      title: 'Teléfono',
      text: '+58 424-1234567',
    },
    {
      icon: <FaMapMarkerAlt className="text-indigo-600 text-xl mt-1" />,
      title: 'Dirección',
      text: 'Calle Real de los Flores de Catia con calle Andrés Bello, Edif. Jesús Obrero, Los Flores de Catia, Parroquia Sucre, Distrito Capital, Caracas 1030.',
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 bg-gray-50">
      {/* Título */}
      <h1 className="text-4xl font-extrabold text-indigo-700 text-center mb-4 animate-fadeIn">Contacto</h1>

      {/* Descripción */}
      <p className="text-lg text-center text-gray-600 mb-12 animate-fadeIn delay-100">
        Ponte en contacto con nosotros a través de los siguientes medios o completa el formulario.
      </p>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
        {/* Información de contacto */}
        <div className="space-y-6">
          {contactos.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start space-x-4 p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="shrink-0">{item.icon}</div>
              <div>
                <p className="font-semibold text-gray-800">{item.title}</p>
                <p className="text-gray-600 text-sm">{item.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-md space-y-6 animate-fadeIn delay-150"
        >
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">Envíanos tu mensaje</h2>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
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
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
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
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
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
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300"
          >
            Enviar Mensaje
          </button>
        </form>
      </div>

      {/* Mapa */}
      <div className="max-w-5xl mx-auto mt-12 animate-fadeIn delay-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Ubicación</h2>
        <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-xl">
          <Mapa />
        </div>
      </div>
    </div>
  );
}
