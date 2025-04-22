import { motion } from "framer-motion";
import { CalendarDays, Laptop, Clock, DollarSign } from "lucide-react";

export default function Lista() {
  const cursos = [
    {
      nombre: "Curso de Desarrollo Web",
      fechaInicio: "01/05/2025",
      modalidad: "Presencial",
      horasAcademicas: 40,
      costo: "$150 USD",
    },
    {
      nombre: "Curso de React",
      fechaInicio: "15/05/2025",
      modalidad: "Online",
      horasAcademicas: 35,
      costo: "$120 USD",
    },
    {
      nombre: "Curso de Python",
      fechaInicio: "22/05/2025",
      modalidad: "Híbrido",
      horasAcademicas: 30,
      costo: "$100 USD",
    },
  ];

  return (
    <div className="pt-20 py-16 px-6 ">
      {/* Título */}
      <motion.h1
        className="text-4xl font-extrabold text-indigo-700 text-center mb-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        PROGRAMACIÓN PERMANENTE DE CURSOS
      </motion.h1>

      {/* Descripción */}
      <motion.p
        className="text-center text-lg text-gray-600 opacity-80 mb-12 max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.7 }}
      >
        Aquí se encuentran todos nuestros cursos disponibles. Consulta los detalles
         y escoge el que más se ajuste a tus intereses.
      </motion.p>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {cursos.map((curso, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-xl shadow-md p-6 border hover:border-indigo-400 transition-all duration-300 hover:shadow-xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.6, type: "spring" }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            <h3 className="text-2xl font-bold text-indigo-700 mb-4">{curso.nombre}</h3>

            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-indigo-500" />
                <span><strong>Inicio:</strong> {curso.fechaInicio}</span>
              </li>
              <li className="flex items-center gap-2">
                <Laptop className="w-5 h-5 text-indigo-500" />
                <span><strong>Modalidad:</strong> {curso.modalidad}</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-500" />
                <span><strong>Horas:</strong> {curso.horasAcademicas}</span>
              </li>
              <li className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-indigo-500" />
                <span><strong>Costo:</strong> {curso.costo}</span>
              </li>
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
