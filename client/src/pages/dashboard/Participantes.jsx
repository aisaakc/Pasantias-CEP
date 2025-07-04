import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getParticipantesPorCohorte, getHorariosByCohorte, updateAsistenciaParticipante } from '../../api/curso.api';
import { toast } from 'sonner';

export default function Participantes() {
  const { cohorteId } = useParams();
  const navigate = useNavigate();
  const [participantes, setParticipantes] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAsistencia, setLoadingAsistencia] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!cohorteId) return;
      setLoading(true);
      try {
        const [resPart, resHor] = await Promise.all([
          getParticipantesPorCohorte(cohorteId),
          getHorariosByCohorte(cohorteId)
        ]);
        setParticipantes(resPart.data.data || []);
        setHorarios(resHor.data.data || []);
      } catch {
        setParticipantes([]);
        setHorarios([]);
      }
      setLoading(false);
    };
    fetchData();
  }, [cohorteId]);

  const handleCheck = async (idParticipante, idHorario, checked) => {
    setLoadingAsistencia(true);
    try {
      await updateAsistenciaParticipante(cohorteId, idParticipante, idHorario, checked);
      setParticipantes(prev => prev.map(p => {
        if (p.idp === idParticipante) {
          const asistencias = { ...(p.asistencias || {}) };
          asistencias[idHorario] = checked;
          return { ...p, asistencias };
        }
        return p;
      }));
      toast.success('Asistencia actualizada');
    } catch {
      toast.error('Error al actualizar asistencia');
    }
    setLoadingAsistencia(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4 flex flex-col items-center">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl p-8 mb-8 animate-fadeInUp">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight">Participantes de la Cohorte</h1>
          <button
            onClick={() => navigate('/dashboard/listado')}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-all duration-300"
          >
            ← Volver a mis cursos
          </button>
        </div>
        {loading ? (
          <div className="text-center text-gray-500 py-10 animate-pulse">Cargando participantes y horarios...</div>
        ) : participantes.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No hay participantes inscritos en esta cohorte.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl shadow border border-blue-100">
              <thead className="bg-blue-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Nombre</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Apellido</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Cédula</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Correo</th>
                  {horarios.map(h => (
                    <th key={h.id || h.fecha_hora_inicio} className="px-4 py-3 text-center text-xs font-bold text-blue-700 uppercase tracking-wider">
                      {h.descripcion ? h.descripcion : new Date(h.fecha_hora_inicio).toLocaleDateString('es-VE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {participantes.map((p, idx) => (
                  <tr key={p.idp} className={idx % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
                    <td className="px-4 py-4 whitespace-nowrap text-gray-800 font-medium">{p.nombre}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-gray-800">{p.apellido}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-gray-700">{p.cedula}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-blue-600 underline">{p.gmail}</td>
                    {horarios.map(h => (
                      <td key={h.id || h.fecha_hora_inicio} className="px-4 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={!!(p.asistencias && p.asistencias[h.id])}
                          disabled={loadingAsistencia}
                          onChange={e => handleCheck(p.idp, h.id, e.target.checked)}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
