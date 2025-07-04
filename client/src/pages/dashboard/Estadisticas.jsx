import React, { useEffect, useState } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale, Legend, Tooltip, ArcElement } from 'chart.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar } from '@fortawesome/free-solid-svg-icons';
import { getParticipantesPorCohorte, getAllCursos, getCohortesPorCurso } from '../../api/curso.api';

Chart.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip, ArcElement);

export default function Estadisticas() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cohorteSeleccionada, setCohorteSeleccionada] = useState('');
  const [tipoGrafico, setTipoGrafico] = useState('bar'); // 'bar', 'pie', 'line'

  // Estado para la gráfica de género por cohorte seleccionada
  const [generoCohorte, setGeneroCohorte] = useState({ masculino: 0, femenino: 0 });

  // Estado para cohortes agrupadas por curso
  const [cohortesPorCurso, setCohortesPorCurso] = useState([]);

  useEffect(() => {
    fetch('/api/cursos/estadisticas/cohortes-participantes')
      .then(res => res.json())
      .then(async res => {
        let cohortes = res.data || [];
        // Obtener todos los cursos para buscar el código de cohorte
        const cursosRes = await getAllCursos();
        const cursos = cursosRes.data.data || [];
        // Agregar el código de cohorte a cada cohorte si existe
        cohortes = cohortes.map(cohorte => {
          // Buscar el curso correspondiente por nombre de cohorte y curso
          const cursoMatch = cursos.find(c => c.id_curso && c.id_nombre === cohorte.id_nombre && c.codigo_cohorte);
          return {
            ...cohorte,
            codigo_cohorte: cursoMatch ? cursoMatch.codigo_cohorte : undefined,
            id_curso: cursoMatch ? cursoMatch.id_curso : cohorte.id_curso,
          };
        });
        setData(cohortes);
        setLoading(false);
      });
    // Obtener cohortes agrupadas por curso para el select
    getCohortesPorCurso().then(res => {
      console.log('[FRONTEND] Respuesta de getCohortesPorCurso:', res.data);
      setCohortesPorCurso(res.data.data || []);
      if (!res.data.data || res.data.data.length === 0) {
        console.warn('[FRONTEND] No se recibieron cohortes para el select');
      }
    });
  }, []);

  // Procesar datos para Chart.js
  const labels = data.map(item => {
    if (item.codigo_cohorte) {
      return `${item.cohorte} (${item.curso}) [${item.codigo_cohorte}]`;
    }
    return `${item.cohorte} (${item.curso})`;
  });
  const masculino = data.map(item =>
    item.participantes.filter(p => Number(p.id_genero) === 6).length
  );
  const femenino = data.map(item =>
    item.participantes.filter(p => Number(p.id_genero) === 7).length
  );

  // Guardar los nombres de los participantes por cohorte y género
  const nombresMasculino = data.map(item =>
    item.participantes.filter(p => Number(p.id_genero) === 6).map(p => `${p.nombre} ${p.apellido}`)
  );
  const nombresFemenino = data.map(item =>
    item.participantes.filter(p => Number(p.id_genero) === 7).map(p => `${p.nombre} ${p.apellido}`)
  );

  // Estado para la gráfica filtrada por cohorte
  const [chartDataFiltrado, setChartDataFiltrado] = useState(null);

  // Filtrar datos para el gráfico principal según la cohorte seleccionada
  let chartData;
  if (cohorteSeleccionada) {
    // Buscar la cohorte seleccionada en cohortesPorCurso
    const cohorte = cohortesPorCurso.find(c => String(c.id_curso) === cohorteSeleccionada);
    if (cohorte) {
      chartData = {
        labels: [cohorte.nombre_cohorte + (cohorte.codigo_cohorte ? ` [${cohorte.codigo_cohorte}]` : '')],
        datasets: [
          {
            label: 'Masculino',
            data: [generoCohorte.masculino],
            backgroundColor: '#3b82f6',
            nombres: [[]],
          },
          {
            label: 'Femenino',
            data: [generoCohorte.femenino],
            backgroundColor: '#f472b6',
            nombres: [[]],
          },
        ],
      };
      console.log('[FRONTEND] chartData para cohorte seleccionada:', chartData);
    } else {
      chartData = {
        labels,
        datasets: [
          {
            label: 'Masculino',
            data: masculino,
            backgroundColor: '#3b82f6',
            nombres: nombresMasculino,
          },
          {
            label: 'Femenino',
            data: femenino,
            backgroundColor: '#f472b6',
            nombres: nombresFemenino,
          },
        ],
      };
      console.log('[FRONTEND] chartData para todas las cohortes:', chartData);
    }
  } else {
    chartData = {
      labels,
      datasets: [
        {
          label: 'Masculino',
          data: masculino,
          backgroundColor: '#3b82f6',
          nombres: nombresMasculino,
        },
        {
          label: 'Femenino',
          data: femenino,
          backgroundColor: '#f472b6',
          nombres: nombresFemenino,
        },
      ],
    };
    console.log('[FRONTEND] chartData para todas las cohortes:', chartData);
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            const nombres = context.dataset.nombres?.[context.dataIndex] || [];
            let nombresStr = nombres.length > 0 ? `\n- ${nombres.join('\n- ')}` : '';
            return `${label}: ${value}${nombresStr}`;
          }
        }
      },
    },
    scales: {
      x: { stacked: true },
      y: { beginAtZero: true, stacked: true },
    },
  };

  // Opciones para el gráfico de líneas
  const lineData = {
    labels: chartDataFiltrado ? chartDataFiltrado.labels : chartData.labels,
    datasets: chartDataFiltrado ? chartDataFiltrado.datasets : chartData.datasets,
  };
  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: { enabled: true },
    },
    scales: {
      x: { beginAtZero: true },
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
            <FontAwesomeIcon icon={faChartBar} className="mr-3 text-blue-600" />
            Estadísticas
          </h1>
          <p className="text-gray-600">Visualiza estadísticas y reportes del sistema.</p>
        </div>
        {/* Filtro de tipo de gráfico */}
        <div className="mb-6">
          <label className="mr-2 font-semibold">Tipo de gráfico:</label>
          <select
            className="p-2 border rounded"
            value={tipoGrafico}
            onChange={e => setTipoGrafico(e.target.value)}
          >
            <option value="bar">Barras</option>
            <option value="pie">Pastel</option>
            <option value="line">Líneas</option>
          </select>
        </div>
        {/* Selector de cohorte agrupado por curso */}
        <div className="mb-6">
          <label className="mr-2 font-semibold">Selecciona una cohorte:</label>
          {console.log('[FRONTEND] cohortesPorCurso:', cohortesPorCurso)}
          <select
            className="p-2 border rounded"
            value={cohorteSeleccionada}
            onChange={async (e) => {
              console.log('[FRONTEND] Cambio en el select de cohorte, value:', e.target.value);
              setCohorteSeleccionada(e.target.value);
              setChartDataFiltrado(null);
              setGeneroCohorte({ masculino: 0, femenino: 0 });
              if (!e.target.value) {
                console.log('[FRONTEND] Seleccionado Todas, no hago petición');
                return;
              }
              const cohorte = cohortesPorCurso.find(c => String(c.id_curso) === e.target.value);
              if (!cohorte) {
                console.warn('[FRONTEND] Cohorte no encontrada para id:', e.target.value);
                return;
              }
              console.log('[FRONTEND] Voy a pedir participantes para id_curso:', cohorte.id_curso);
              try {
                const res = await getParticipantesPorCohorte(cohorte.id_curso);
                const participantes = res.data.data || [];
                console.log('[FRONTEND] Participantes recibidos:', participantes);
                participantes.forEach(p => console.log('[FRONTEND] Participante:', p));
                const masculino = participantes.filter(p => Number(p.id_genero) === 6).length;
                const femenino = participantes.filter(p => Number(p.id_genero) === 7).length;
                console.log('[FRONTEND] Masculino:', masculino, 'Femenino:', femenino);
                setGeneroCohorte({ masculino, femenino });
              } catch (err) {
                console.error('[FRONTEND] Error al pedir participantes:', err);
                setGeneroCohorte({ masculino: 0, femenino: 0 });
              }
            }}
          >
            <option value="">Todas</option>
            {(() => {
              const agrupado = cohortesPorCurso.reduce((acc, cohorte) => {
                if (!acc[cohorte.nombre_curso]) acc[cohorte.nombre_curso] = [];
                acc[cohorte.nombre_curso].push(cohorte);
                return acc;
              }, {});
              console.log('[FRONTEND] Agrupación para optgroup:', agrupado);
              const allOptions = [];
              Object.entries(agrupado).forEach(([curso, cohortes]) => {
                const opts = cohortes.map(cohorte => {
                  const value = String(cohorte.id_curso);
                  console.log('[FRONTEND] Opción generada:', { value, label: `${cohorte.nombre_cohorte} [${cohorte.codigo_cohorte}]` });
                  return (
                    <option key={cohorte.id_curso} value={value}>
                      {cohorte.nombre_cohorte} [{cohorte.codigo_cohorte}]
                    </option>
                  );
                });
                allOptions.push(
                  <optgroup key={curso} label={curso}>
                    {opts}
                  </optgroup>
                );
              });
              return allOptions;
            })()}
          </select>
        </div>
        {/* Gráfico principal dinámico */}
        {loading ? (
          <div className="text-center text-gray-500">Cargando datos...</div>
        ) : (
          <>
            {tipoGrafico === 'bar' && (
              <Bar data={chartDataFiltrado || chartData} options={options} />
            )}
            {tipoGrafico === 'pie' && (
              <Pie
                data={{
                  labels: (chartDataFiltrado || chartData).labels,
                  datasets: [
                    {
                      data: (chartDataFiltrado || chartData).datasets.map(ds => ds.data[0] ?? 0),
                      backgroundColor: ['#3b82f6', '#f472b6', '#a3a3a3', '#fbbf24', '#10b981'],
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top' },
                    tooltip: { enabled: true },
                  },
                }}
              />
            )}
            {tipoGrafico === 'line' && (
              <Line data={lineData} options={lineOptions} />
            )}
          </>
        )}
        {/* Gráfico de género por cohorte seleccionada */}
        {(generoCohorte.masculino + generoCohorte.femenino > 0) && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-2">Distribución de género en la cohorte seleccionada</h2>
            {tipoGrafico === 'pie' ? (
              <Pie
                data={{
                  labels: ['Masculino', 'Femenino'],
                  datasets: [{
                    data: [generoCohorte.masculino, generoCohorte.femenino],
                    backgroundColor: ['#3b82f6', '#f472b6'],
                  }]
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top' },
                    tooltip: { enabled: true },
                  },
                }}
              />
            ) : (
              <Bar
                data={{
                  labels: ['Masculino', 'Femenino'],
                  datasets: [{
                    label: 'Cantidad',
                    data: [generoCohorte.masculino, generoCohorte.femenino],
                    backgroundColor: ['#3b82f6', '#f472b6'],
                  }]
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                    tooltip: { enabled: true },
                  },
                  scales: {
                    y: { beginAtZero: true }
                  }
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
