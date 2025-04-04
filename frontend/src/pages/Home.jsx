export default function Home() {
    return (
      <div className="mt-6 bg-white rounded-2xl shadow-md p-6 space-y-4">
        <h1 className="text-3xl font-bold text-blue-600 border-b pb-2">Coordinación de Extensión Profesional (CEP)</h1>
        <p className="text-gray-700 leading-relaxed">
          El CEP del IUJO tiene como objetivo brindar formación técnica y profesional accesible para todas las personas,
          promoviendo el desarrollo integral a través de cursos en distintas áreas del conocimiento.
        </p>
  
        <div className="bg-blue-100 border border-blue-300 text-blue-800 p-4 rounded-lg mt-4">
          <h2 className="text-xl font-semibold">📚 Cursos Disponibles:</h2>
          <p className="text-lg mt-2">Actualmente contamos con <span className="font-bold">12 cursos activos</span> en diversas áreas.</p>
        </div>
      </div>
    );
  }
  