import React, { useEffect, useState } from 'react';
import { getCursosByFacilitador } from '../../api/curso.api';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

export default function Listado() {
  const { user } = useAuthStore();
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCursos = async () => {
      if (!user?.id_persona) return;
      setLoading(true);
      try {
        const res = await getCursosByFacilitador(user.id_persona);
        setCursos(res.data.data || []);
      } catch {
        setCursos([]);
      }
      setLoading(false);
    };
    fetchCursos();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Mis Cursos como Facilitador</h1>
        {loading ? (
          <div className="text-center text-gray-500 py-10">Cargando cursos...</div>
        ) : cursos.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No tienes cursos asignados.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {cursos.map((curso) => (
              <div key={curso.id_curso} className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center border border-blue-100 hover:shadow-xl transition-all duration-300">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl text-blue-600 font-bold">{curso.nombre_curso?.charAt(0) || '?'}</span>
                </div>
                <h2 className="text-xl font-bold text-blue-700 mb-2 text-center">{curso.nombre_curso}</h2>
                <p className="text-gray-600 text-center mb-2">Modalidad: <b>{curso.modalidad || 'No definida'}</b></p>
                <p className="text-gray-600 text-center mb-2">Estado: <b>{curso.estado || 'No definido'}</b></p>
                <p className="text-gray-600 text-center mb-2">Inicio: <b>{curso.fecha_hora_inicio ? new Date(curso.fecha_hora_inicio).toLocaleString() : 'No definido'}</b></p>
                <p className="text-gray-600 text-center mb-2">Fin: <b>{curso.fecha_hora_fin ? new Date(curso.fecha_hora_fin).toLocaleString() : 'No definido'}</b></p>
                <p className="text-gray-700 text-center mt-2">{curso.descripcion_corto || 'Sin descripción.'}</p>
                <button
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-all duration-300"
                  onClick={() => navigate(`/dashboard/participantes/${curso.id_curso}`)}
                >
                  Ver Participantes
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
