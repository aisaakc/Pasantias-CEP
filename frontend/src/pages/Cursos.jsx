const cursos = [
    {
      nombre: 'Técnico en Informática',
      fechaInicio: '10/04/2025',
      modalidad: 'Presencial',
      horario: '8:00 AM - 12:00 PM',
      horas: 120,
      costo: '$80',
      imagen: 'https://source.unsplash.com/featured/?computer,tech',
    },
    {
      nombre: 'Diseño Gráfico Básico',
      fechaInicio: '15/04/2025',
      modalidad: 'Online',
      horario: '6:00 PM - 9:00 PM',
      horas: 90,
      costo: '$70',
      imagen: 'https://source.unsplash.com/featured/?design,creative',
    },
    {
      nombre: 'Auxiliar Contable',
      fechaInicio: '22/04/2025',
      modalidad: 'Presencial',
      horario: '2:00 PM - 6:00 PM',
      horas: 100,
      costo: '$75',
      imagen: 'https://source.unsplash.com/featured/?finance,accounting',
    },
  ];
  
  export default function Cursos() {
    return (
        <div className="mt-6 space-y-12 mb-16"> {/* Añadido un margen inferior para evitar que se solape con el footer */}
        <h1 className="text-3xl font-bold text-blue-600 border-b pb-2 mb-6">Cursos Disponibles</h1>
  
        <div className="space-y-6">
          {cursos.map((curso, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300"
            >
              <img
                src={curso.imagen}
                alt={curso.nombre}
                className="md:w-64 h-48 md:h-auto object-cover"
              />
              <div className="p-6 flex flex-col justify-between w-full">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{curso.nombre}</h2>
  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700 text-sm">
                    <p><span className="font-medium">📅 Fecha de Inicio:</span> {curso.fechaInicio}</p>
                    <p><span className="font-medium">🧑‍💻 Modalidad:</span> {curso.modalidad}</p>
                    <p><span className="font-medium">🕒 Horario:</span> {curso.horario}</p>
                    <p><span className="font-medium">⏱️ Duración:</span> {curso.horas} horas</p>
                    <p><span className="font-medium">💰 Costo:</span> {curso.costo}</p>
                  </div>
                </div>
  
                <div className="mt-4 text-right">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                    ¡Inscríbete!
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
  
        {/* ✅ Mensaje final */}
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-5 rounded-md shadow-md">
          <p className="font-semibold">📜 CERTIFICADO DIGITAL ENVIADO AL TERMINAR EL CURSO (CON VALIDACIÓN QR)</p>
          <p className="mt-2">
            <span className="font-bold">NOTA IMPORTANTE:</span> Si para la fecha de inicio del curso no se ha cubierto la matrícula, será pospuesto hasta que sea completada.
          </p>
        </div>
      </div>
    );
  }
  