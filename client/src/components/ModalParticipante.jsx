import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faMoneyBill, faCreditCard, faUniversity, faCalendarAlt, faIdCard, faFileImage, faTimes, faSave, faBook } from '@fortawesome/free-solid-svg-icons';
import { useCursoStore } from '../store/cursoStore';
import useAuthStore from '../store/authStore';


export default function ModalParticipante({ onClose }) {
  const addParticipante = useCursoStore((state) => state.addParticipante);
  const { user } = useAuthStore();
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
  const cursos = useCursoStore((state) => state.cursos);
  const fetchCursos = useCursoStore((state) => state.fetchCursos);
  const formasPago = useCursoStore((state) => state.formasPago);
  const bancos = useCursoStore((state) => state.bancos);
  const fetchFormasPagoYBancos = useCursoStore((state) => state.fetchFormasPagoYBancos);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCursos();
    fetchFormasPagoYBancos();
  }, [fetchCursos, fetchFormasPagoYBancos]);

  // Depuración: mostrar cursos en consola
  useEffect(() => {
    console.log('Cursos disponibles:', cursos);
  }, [cursos]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
      return;
    }

    let processedValue = value;
    if (name === 'monto') {
      processedValue = value.replace(/[^0-9.]/g, '');
    } else if (['nro_referencia', 'cedula_cuenta'].includes(name)) {
      processedValue = value.replace(/[^0-9]/g, '');
    }

    setForm((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    let soporte_pago_url = form.soporte_pago ? form.soporte_pago.name : '';
    const participante = {
      id_usuario: user?.id_persona,
      nombre: `${user?.nombre} ${user?.apellido}`,
      curso_id: Number(form.curso_id),
      monto: Number(form.monto),
      forma_pago: Number(form.forma_pago),
      nro_referencia: form.nro_referencia,
      banco: Number(form.banco),
      fecha_pago: form.fecha_pago,
      cedula_cuenta: form.cedula_cuenta,
      soporte_pago: soporte_pago_url,
    };
    addParticipante(participante);
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
    setIsSubmitting(false);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center perspective-1000">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-500" onClick={onClose} />
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl transform transition-all duration-500 animate-modal-in flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="relative overflow-hidden p-6 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent flex items-center gap-2">
              <FontAwesomeIcon icon={faUser} className="text-blue-600" />
              Inscribir en Curso
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full transform hover:rotate-90 duration-300">
              <FontAwesomeIcon icon={faTimes} className="text-xl" />
            </button>
          </div>
        </div>
        {/* Contenido */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FontAwesomeIcon icon={faBook} className="mr-2 text-blue-500" /> Curso
              </label>
              <select name="curso_id" value={form.curso_id} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300 bg-white">
                <option value="">Seleccione un curso</option>
                {Array.isArray(cursos) && cursos.map((c) => (
                  <option key={c.id_curso} value={c.id_curso}>
                    {`${c.codigo || ''} - ${c.nombre_curso || ''} ${c.costo || ''}.$`}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FontAwesomeIcon icon={faMoneyBill} className="mr-2 text-blue-500" /> Monto
              </label>
              <input name="monto" type="text" inputMode="decimal" value={form.monto} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FontAwesomeIcon icon={faCreditCard} className="mr-2 text-blue-500" /> Forma de Pago
              </label>
              <select name="forma_pago" value={form.forma_pago} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300 bg-white">
                <option value="">Seleccione</option>
                {Array.isArray(formasPago) && formasPago.map((f) => (
                  <option key={f.id} value={f.id}>{f.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FontAwesomeIcon icon={faCreditCard} className="mr-2 text-blue-500" /> Nro Referencia
              </label>
              <input name="nro_referencia" value={form.nro_referencia} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300" inputMode="numeric" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FontAwesomeIcon icon={faUniversity} className="mr-2 text-blue-500" /> Banco
              </label>
              <select name="banco" value={form.banco} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300 bg-white">
                <option value="">Seleccione</option>
                {Array.isArray(bancos) && bancos.map((b) => (
                  <option key={b.id} value={b.id}>{b.nombre}{b.descripcion ? ` (${b.descripcion})` : ''}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-blue-500" /> Fecha de Pago
              </label>
              <input name="fecha_pago" type="date" value={form.fecha_pago} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FontAwesomeIcon icon={faIdCard} className="mr-2 text-blue-500" /> Cédula de la Cuenta
              </label>
              <input name="cedula_cuenta" value={form.cedula_cuenta} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300" inputMode="numeric" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FontAwesomeIcon icon={faFileImage} className="mr-2 text-blue-500" /> Soporte de Pago
              </label>
              <input name="soporte_pago" type="file" accept="image/*" onChange={handleChange} required className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300 bg-white" />
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
              <FontAwesomeIcon icon={faTimes} className="mr-2" />
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-sm hover:shadow-lg flex items-center gap-2 disabled:opacity-50"
              disabled={isSubmitting}
            >
              <FontAwesomeIcon icon={faSave} className={`mr-2 ${isSubmitting ? 'animate-spin' : ''}`} />
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
  );
}