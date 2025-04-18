import { Mail, Phone, MapPin } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Mapa from '../../components/Mapa';

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

  return (
    <div className="py-12 px-6 bg-gray-50">
      <motion.h1
        className="text-4xl font-extrabold text-indigo-600 text-center mb-8"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Contacto
      </motion.h1>

      <motion.p
        className="text-lg text-center text-gray-600 mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        Ponte en contacto con nosotros a través de los siguientes medios o completa el formulario.
      </motion.p>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Información de contacto */}
        <motion.div
          className="space-y-6"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
        >
          {[ 
            {
              icon: <Mail size={28} className="text-indigo-600 mt-1" />,
              title: "Email",
              text: "contacto@cep.org"
            },
            {
              icon: <Phone size={28} className="text-indigo-600 mt-1" />,
              title: "Teléfono",
              text: "+58 424-1234567"
            },
            {
              icon: <MapPin size={28} className="text-indigo-600 mt-1" />,
              title: "Dirección",
              text: "Calle Real de los Flores de Catia con calle Andrés Bello, Edif. Jesús Obrero, Los Flores de Catia, Parroquia Sucre, Distrito Capital, Caracas 1030."
            }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow hover:shadow-md transition"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4, delay: idx * 0.2 }}
            >
              {item.icon}
              <div>
                <p className="font-semibold text-gray-800">{item.title}</p>
                <p className="text-gray-600">{item.text}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Formulario */}
        <motion.form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow space-y-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold text-gray-800 text-center">Envíanos tu mensaje</h2>
          <div>
            <label htmlFor="name" className="block text-gray-700 font-medium mb-1">Nombre</label>
            <input
              type="text"
              name="name"
              id="name"
              value={form.name}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              placeholder="Tu nombre"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={form.email}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              placeholder="Tu correo electrónico"
              required
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-gray-700 font-medium mb-1">Mensaje</label>
            <textarea
              name="message"
              id="message"
              value={form.message}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              placeholder="Escribe tu mensaje"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            Enviar Mensaje
          </button>
        </motion.form>
      </div>

      {/* Mapa */}
      <motion.div
  className="max-w-5xl mx-auto mt-10"
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  transition={{ duration: 0.7 }}
  viewport={{ once: true }}
>
  <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Ubicación </h2>
  <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg">
    <Mapa />
  </div>
</motion.div>

    </div>
  );
}
