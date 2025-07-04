import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as solidIcons from '@fortawesome/free-solid-svg-icons';
import { useCursoStore } from '../store/cursoStore';
import { CLASSIFICATION_IDS } from '../config/classificationIds';
import useAuthStore from '../store/authStore';
import Select from 'react-select';
import { TreeSelect } from 'primereact/treeselect';
import { getJerarquiaDesde } from '../api/clasificacion.api';
import { addParticipanteToCohorte } from '../api/curso.api';
import 'primeicons/primeicons.css';
import { Dialog } from 'primereact/dialog';

export default function ModalParticipante({ onClose }) {
  // const updateCurso = useCursoStore((state) => state.updateCurso); // Elimino porque no se usa
  const [form, setForm] = useState({
    curso_id: '',
    monto: '',
    forma_pago: '',
    nro_referencia: '',
    banco: '',
    fecha_pago: '',
    cedula_cuenta: '',
    soporte_pago: null,
  });
  const fetchCursos = useCursoStore((state) => state.fetchCursos);
  const formasPago = useCursoStore((state) => state.formasPago);
  const bancos = useCursoStore((state) => state.bancos);
  const fetchFormasPagoYBancos = useCursoStore((state) => state.fetchFormasPagoYBancos);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuthStore();
  const [jerarquiaCursos, setJerarquiaCursos] = useState([]);
  const [showWelcome, setShowWelcome] = useState(false);
  const [nombreCursoBienvenida, setNombreCursoBienvenida] = useState('');

  // Log al inicio del componente
  console.log('[DEBUG FRONTEND] user al montar ModalParticipante:', user);

  // Cargar el tema de PrimeReact solo cuando la modal está abierta
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/primereact/resources/themes/lara-light-indigo/theme.css';
    link.id = 'primereact-theme';
    document.head.appendChild(link);
    return () => {
      const themeLink = document.getElementById('primereact-theme');
      if (themeLink) document.head.removeChild(themeLink);
    };
  }, []);

  useEffect(() => {
    fetchCursos();
    fetchFormasPagoYBancos();
    getJerarquiaDesde(CLASSIFICATION_IDS.INSTITUTOS)
      .then(res => {
        console.log('[DEBUG FRONTEND] Jerarquía recibida del backend:', res.data);
        setJerarquiaCursos(res.data);
      })
      .catch(() => setJerarquiaCursos([]));
  }, [fetchCursos, fetchFormasPagoYBancos]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
      return;
    }

    if (name === 'monto') {
      setForm((prev) => ({ ...prev, [name]: value }));
      return;
    } else if (["nro_referencia", "cedula_cuenta"].includes(name)) {
      const processedValue = value.replace(/[^0-9]/g, '');
      setForm((prev) => ({ ...prev, [name]: processedValue }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Solo permitir seleccionar nodos hoja (cohorte)
  const isCohorteNode = (node) => node && node.data && node.data.nivel === 6; // Ajusta el nivel según tu jerarquía

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Log del form completo y usuario
      console.log('[DEBUG FRONTEND] handleSubmit form:', form);
      console.log('[DEBUG FRONTEND] handleSubmit user:', user);
      // Validar que se seleccionó una cohorte
      const selectedNode = flattenTree(treeSelectNodes).find(
        n => String(n.value) === String(form.curso_id)
      );
      if (!isCohorteNode(selectedNode)) {
        alert('Debes seleccionar una cohorte (nodo hoja)');
        setIsSubmitting(false);
        return;
      }
      // Validar monto
      const montoNum = Number(form.monto);
      if (isNaN(montoNum) || montoNum <= 0) {
        alert('El monto debe ser un número válido y mayor a 0');
        setIsSubmitting(false);
        return;
      }
      // Log para depurar el id_persona
      console.log('[DEBUG FRONTEND] user?.id_persona:', user?.id_persona);
      // Agregar participante a la cohorte
      const payload = {
        idP: user?.id_persona,
        monto: montoNum
      };
      console.log('[DEBUG FRONTEND] Enviando inscripción:', {
        curso_id: form.curso_id,
        ...payload
      });
      await addParticipanteToCohorte(form.curso_id, payload);
      setForm({
        curso_id: '',
        monto: '',
        forma_pago: '',
        nro_referencia: '',
        banco: '',
        fecha_pago: '',
        cedula_cuenta: '',
        soporte_pago: null,
      });
      // Mostrar modal de bienvenida
      setNombreCursoBienvenida(selectedNode?.label || 'el curso');
      setShowWelcome(true);
      setIsSubmitting(false);
      // No cerrar la modal principal automáticamente
      // if (onClose) onClose();
    } catch (error) {
      setIsSubmitting(false);
      const msg = error?.response?.data?.error || error?.message || 'Error al inscribirse en el curso';
      alert(msg);
    }
  };

  // Función para aplanar el árbol y buscar nodos
  function flattenTree(nodes) {
    if (!Array.isArray(nodes)) return [];
    return nodes.flatMap(node => [node, ...(node.children ? flattenTree(node.children) : [])]);
  }

  // Función para transformar la jerarquía a formato TreeSelect de PrimeReact con íconos FontAwesome dinámicos
  function toTreeSelectFormat(options) {
    return options.map(opt => ({
      key: String(opt.id),
      label: opt.nombre,
      value: opt.id,
      data: opt,
      isLeaf: (opt.nivel === 6 || opt.es_cohorte === true),
      ...(opt.hijos && opt.hijos.length > 0
        ? { children: toTreeSelectFormat(opt.hijos) }
        : {})
    }));
  }

  // Transformar los datos reales al formato TreeSelect
  const treeSelectNodes = toTreeSelectFormat(jerarquiaCursos);
  console.log('[DEBUG FRONTEND] Árbol para TreeSelect:', treeSelectNodes);
  console.log('[DEBUG FRONTEND] Valor seleccionado en TreeSelect:', form.curso_id);

  // Log para ver cómo se construyen los labels de los nodos hoja
  function logLeafLabels(nodes) {
    nodes.forEach(node => {
      if (node.isLeaf) {
        console.log('[DEBUG FRONTEND] Nodo hoja label:', node.label, 'value:', node.value, 'data:', node.data);
      }
      if (node.children) logLeafLabels(node.children);
    });
  }
  useEffect(() => {
    if (treeSelectNodes.length > 0) {
      logLeafLabels(treeSelectNodes);
    }
  }, [treeSelectNodes]);

  // Log para ver el nodo seleccionado cuando cambia el valor
  useEffect(() => {
    if (form.curso_id) {
      const selectedNode = flattenTree(treeSelectNodes).find(
        n => String(n.value) === String(form.curso_id)
      );
      console.log('[DEBUG FRONTEND] Nodo seleccionado:', selectedNode);
    }
  }, [form.curso_id, treeSelectNodes]);

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center perspective-1000">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-500" onClick={onClose} />
        <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl transform transition-all duration-500 animate-modal-in flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="relative overflow-hidden p-6 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent flex items-center gap-2">
                <FontAwesomeIcon icon={solidIcons.faBook} className="text-blue-600" />
                Inscribir en Curso (Cohorte)
              </h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full transform hover:rotate-90 duration-300">
                <FontAwesomeIcon icon={solidIcons.faTimes} className="text-xl" />
              </button>
            </div>
          </div>
          {/* Contenido */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 mb-10">
                <label className="block text-lg font-bold text-blue-700 mb-2 flex items-center gap-2">
                  <FontAwesomeIcon icon={solidIcons.faBook} className="text-2xl text-blue-500" />
                  Curso (Cohorte)
                  <span className="ml-2 text-xs text-gray-400 font-normal">Seleccione el Curso (Cohorte) para inscribirse</span>
                </label>
                <div className="card flex justify-content-center p-0">
                  <TreeSelect
                    variant="filled"
                    value={form.curso_id}
                    onChange={e => {
                      setForm(prev => ({ ...prev, curso_id: e.value }));
                    }}
                    options={treeSelectNodes}
                    filter
                    className="w-full md:w-80 custom-treeselect"
                    placeholder={
                      <span>
                        <FontAwesomeIcon icon={solidIcons.faBook} className="mr-2 text-blue-500" />
                        Seleccione el curso y cohorte al que desea inscribirse
                      </span>
                    }
                    panelStyle={{
                      zIndex: 99999,
                      background: 'linear-gradient(135deg, #e0f7fa 0%, #fff 100%)',
                      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                      borderRadius: '18px',
                      padding: '10px',
                      animation: 'fadeInDown 0.3s'
                    }}
                    appendTo={typeof window !== 'undefined' ? document.body : undefined}
                    emptyMessage="No hay opciones disponibles"
                  />
                </div>
                <style>{`
                  @keyframes fadeInDown {
                    from { opacity: 0; transform: translateY(-10px);}
                    to { opacity: 1; transform: translateY(0);}
                  }
                  .custom-treeselect .p-treeselect-panel {
                    border-radius: 18px !important;
                    background: linear-gradient(135deg, #e0f7fa 0%, #fff 100%) !important;
                    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37) !important;
                  }
                  .custom-treeselect .p-treenode-content {
                    transition: background 0.2s, color 0.2s;
                    border-radius: 10px;
                    margin: 2px 0;
                    padding: 8px 12px;
                  }
                  .custom-treeselect .p-treenode-content:hover,
                  .custom-treeselect .p-treenode-content.p-highlight {
                    background: #b3e5fc !important;
                    color: #01579b !important;
                    font-weight: bold;
                  }
                  .custom-treeselect .p-treeselect-label {
                    font-size: 1.1rem;
                    color: #0277bd;
                    font-weight: 500;
                  }
                  .custom-treeselect .pi {
                    font-size: 1.3em;
                    color: #039be5;
                    margin-right: 8px;
                  }
                `}</style>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FontAwesomeIcon icon={solidIcons.faMoneyBill} className="mr-2 text-blue-500" /> Monto
                </label>
                <input
                  name="monto"
                  type="number"
                  step="any"
                  value={form.monto ?? ''}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FontAwesomeIcon icon={solidIcons.faCreditCard} className="mr-2 text-blue-500" /> Forma de Pago
                </label>
                <select name="forma_pago" value={form.forma_pago} onChange={handleChange}  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300 bg-white">
                  <option value="">Seleccione</option>
                  {Array.isArray(formasPago) && formasPago.map((f) => (
                    <option key={f.id} value={f.id}>{f.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FontAwesomeIcon icon={solidIcons.faCreditCard} className="mr-2 text-blue-500" /> Nro Referencia
                </label>
                <input name="nro_referencia" value={form.nro_referencia} onChange={handleChange}  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300" inputMode="numeric" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FontAwesomeIcon icon={solidIcons.faUniversity} className="mr-2 text-blue-500" /> Banco
                </label>
                <select name="banco" value={form.banco} onChange={handleChange}  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300 bg-white">
                  <option value="">Seleccione</option>
                  {Array.isArray(bancos) && bancos.map((b) => (
                    <option key={b.id} value={b.id}>{b.nombre}{b.descripcion ? ` (${b.descripcion})` : ''}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FontAwesomeIcon icon={solidIcons.faCalendarAlt} className="mr-2 text-blue-500" /> Fecha de Pago
                </label>
                <input name="fecha_pago" type="date" value={form.fecha_pago} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FontAwesomeIcon icon={solidIcons.faIdCard} className="mr-2 text-blue-500" /> Cédula de la Cuenta
                </label>
                <input name="cedula_cuenta" value={form.cedula_cuenta} onChange={handleChange}  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300" inputMode="numeric" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FontAwesomeIcon icon={solidIcons.faFileImage} className="mr-2 text-blue-500" /> Soporte de Pago
                </label>
                <input name="soporte_pago" type="file" accept="image/*" onChange={handleChange}  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300 bg-white" />
              </div>
            </div>
            {/* Footer */}
            <div className="relative overflow-hidden border-t border-gray-100 pt-6 bg-gray-50 rounded-b-2xl flex-shrink-0 mt-6 flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-lg text-gray-700 hover:text-gray-900 bg-white border border-gray-200 hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow flex items-center gap-2"
                disabled={isSubmitting}
              >
                <FontAwesomeIcon icon={solidIcons.faTimes} className="mr-2" />
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-sm hover:shadow-lg flex items-center gap-2 disabled:opacity-50"
                disabled={isSubmitting}
              >
                <FontAwesomeIcon icon={solidIcons.faSave} className={`mr-2 ${isSubmitting ? 'animate-spin' : ''}`} />
                {isSubmitting ? 'Guardando...' : 'Inscribirme'}
              </button>
            </div>
          </form>
          <style>{`
            @keyframes modal-in {
              from { opacity: 0; transform: scale(0.95) translateY(10px); }
              to { opacity: 1; transform: scale(1) translateY(0); }
            }
            .animate-modal-in { animation: modal-in 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
          `}</style>
        </div>
      </div>
      <Dialog
        header="¡Inscripción exitosa!"
        visible={showWelcome}
        onHide={() => { setShowWelcome(false); if (onClose) onClose(); }}
        style={{ width: '90%', maxWidth: 400 }}
        closable={false}
        className="rounded-2xl shadow-2xl animate-fadeIn"
        footer={<button onClick={() => { setShowWelcome(false); if (onClose) onClose(); }} className="w-full py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-all duration-300 mt-4">Cerrar</button>}
      >
        <div className="flex flex-col items-center justify-center py-6">
          <FontAwesomeIcon icon={solidIcons.faSmileBeam} className="text-5xl text-blue-500 mb-4 animate-bounce" />
          <h3 className="text-xl font-bold text-blue-700 mb-2 text-center">¡Bienvenido a {nombreCursoBienvenida}!</h3>
          <p className="text-gray-700 text-center">Te has inscrito exitosamente. Revisa tu correo para más detalles.</p>
        </div>
      </Dialog>
    </>
  );
}