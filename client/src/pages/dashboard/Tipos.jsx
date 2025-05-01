import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useClasificacionStore from '../../store/clasificacionStore';
import * as iconos from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { decodeId } from '../../utils/hashUtils';

export default function Tipos() {
  const { id: encodedId } = useParams();
  const realId = decodeId(encodedId);

  const { subClasificaciones, fetchSubClasificaciones, loading, error } = useClasificacionStore();

  // Llamamos a la API para obtener las subclasificaciones con el id real decodificado
  useEffect(() => {
    if (realId) {
      fetchSubClasificaciones(realId);
    }
  }, [realId, fetchSubClasificaciones]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-10">Subclasificaciones</h1>

      {loading ? (
        <p className="text-center text-lg font-semibold">Cargando...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow-lg overflow-hidden">
            <thead className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
              <tr>
                <th className="py-4 px-6 text-left text-sm uppercase tracking-wider">Nombre</th>
                <th className="py-4 px-6 text-left text-sm uppercase tracking-wider">Descripción</th>
                <th className="py-4 px-6 text-center text-sm uppercase tracking-wider">Ícono</th>
              </tr>
            </thead>
            <tbody>
              {subClasificaciones.length > 0 ? (
                subClasificaciones.map((sub) => {
                  // Verifica si el ícono existe y usa un valor predeterminado si no
                  const Icon = iconos[sub.nicono] || iconos.faFile;  // Usa faFile como ícono predeterminado si no existe

                  return (
                    <tr
                      key={sub.id_clasificacion}
                      className="bg-white hover:bg-blue-50 transition-all duration-300 ease-in-out border-b"
                    >
                      <td className="py-4 px-6 font-medium text-gray-800">{sub.nombre}</td>
                      <td className="py-4 px-6 text-gray-600">{sub.descripcion}</td>
                      <td className="py-4 px-6 text-center text-gray-500">
                        {/* Renderiza el ícono */}
                        <FontAwesomeIcon icon={Icon} size="lg" />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="3" className="py-6 text-center text-gray-500">
                    No hay subclasificaciones.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
