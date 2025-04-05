import React, { useState, useEffect } from 'react';

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulate fetching data from an API
    const fetchCourses = async () => {
      // Replace this with an actual API call
      const data = [
        { id: 1, title: 'Curso de Programación', area: 'Tecnología' },
        { id: 2, title: 'Curso de Marketing Digital', area: 'Marketing' },
        { id: 3, title: 'Curso de Diseño Gráfico', area: 'Diseño' },
        // Add more courses as needed
      ];
      setCourses(data);
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mt-6 bg-white rounded-2xl shadow-md p-6 space-y-4">
      <h1 className="text-3xl font-bold text-blue-600 border-b pb-2">Coordinación de Extensión Profesional (CEP)</h1>
      <p className="text-gray-700 leading-relaxed">
        El CEP del IUJO tiene como objetivo brindar formación técnica y profesional accesible para todas las personas,
        promoviendo el desarrollo integral a través de cursos en distintas áreas del conocimiento.
      </p>

      <div className="bg-blue-100 border border-blue-300 text-blue-800 p-4 rounded-lg mt-4">
        <h2 className="text-xl font-semibold">📚 Cursos Disponibles:</h2>
        <input
          type="text"
          placeholder="Buscar cursos..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="mt-2 p-2 border rounded w-full"
        />
        <ul className="mt-4 space-y-2">
          {filteredCourses.map(course => (
            <li key={course.id} className="text-lg">
              <span className="font-bold">{course.title}</span> - {course.area}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
