import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Formik, Form, Field } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faXmark, 
  faSave, 
  faTimes, 
  faUser,
  faEnvelope,
  faVenusMars,
  faUserShield,
  faPhone,
  faLock,
  faShieldAlt,
  faIdCard,
  faQuestionCircle
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'sonner';

const ModalUser = ({ isOpen, onClose, editData = null }) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [animationClass, setAnimationClass] = useState('');

  // Función para validar que solo se ingresen letras y espacios
  const handleOnlyLetters = (e) => {
    const value = e.target.value;
    if (!/^[A-Za-z\s]*$/.test(value)) {
      e.target.value = value.replace(/[^A-Za-z\s]/g, '');
    }
  };

  // Función para validar que solo se ingresen números
  const handleOnlyNumbers = (e) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) {
      e.target.value = value.replace(/\D/g, '');
    }
  };

  // Valores iniciales del formulario
  const initialValues = {
    nombre: editData?.nombre || '',
    apellido: editData?.apellido || '',
    cedula: editData?.cedula || '',
    telefono: editData?.telefono || '',
    gmail: editData?.gmail || '',
    password: editData?.password || '',
    genero: editData?.genero || '',
    pregunta_seguridad: editData?.pregunta_seguridad || '',
    respuesta_seguridad: editData?.respuesta_seguridad || '',
    roles: editData?.roles || []
  };

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      document.body.style.overflow = 'hidden';
      setTimeout(() => setAnimationClass('animate-modal-in'), 10);
    } else {
      setAnimationClass('animate-modal-out');
      document.body.style.overflow = 'unset';
      const timeout = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Aquí iría la lógica para guardar o actualizar el usuario
      console.log('Datos del formulario:', values);
      if (editData) {
        toast.success('Usuario actualizado correctamente');
      } else {
        toast.success('Usuario creado correctamente');
      }
      onClose();
    } catch (err) {
      console.error("Error al guardar:", err);
      toast.error(editData ? 'Error al actualizar el usuario' : 'Error al crear el usuario');
    } finally {
      setSubmitting(false);
    }
  };

  if (!shouldRender) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center perspective-1000">
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`} 
        onClick={onClose}
      />
      
      <div 
        className={`relative w-full max-w-xl bg-white rounded-2xl shadow-2xl transform transition-all duration-500 ${
          animationClass
        } flex flex-col max-h-[90vh]`}
      >
        {/* Header fijo */}
        <div className="relative overflow-hidden p-6 border-b border-gray-100 flex-shrink-0">
          <div className="animate-shine absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {editData ? 'Editar Usuario' : 'Agregar Nuevo Usuario'}
              <FontAwesomeIcon
                icon={faUser}
                className="inline-block ml-2 text-blue-600"
                size="lg"
              />
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full transform hover:rotate-90 duration-300"
            >
              <FontAwesomeIcon icon={faXmark} className="text-xl" />
            </button>
          </div>
        </div>

        {/* Contenido con scroll */}
        <div className="flex-1 overflow-y-auto">
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting }) => (
              <Form className="p-6 space-y-5">
                {[
                  { name: 'nombre', icon: faUser, label: 'Nombre', type: 'text', onInput: handleOnlyLetters },
                  { name: 'apellido', icon: faUser, label: 'Apellido', type: 'text', onInput: handleOnlyLetters },
                  { name: 'cedula', icon: faIdCard, label: 'Cédula', type: 'text', onInput: handleOnlyNumbers },
                  { name: 'telefono', icon: faPhone, label: 'Teléfono', type: 'tel', onInput: handleOnlyNumbers },
                  { name: 'gmail', icon: faEnvelope, label: 'Gmail', type: 'email' },
                  { name: 'password', icon: faLock, label: 'Contraseña', type: 'password' },
                  { name: 'genero', icon: faVenusMars, label: 'Género', type: 'select' },
                  { name: 'pregunta_seguridad', icon: faQuestionCircle, label: 'Pregunta de Seguridad', type: 'select' },
                  { name: 'respuesta_seguridad', icon: faShieldAlt, label: 'Respuesta de Seguridad', type: 'text' },
                ].map((field, index) => (
                  <div 
                    key={field.name}
                    className={`transform transition-all duration-300 animate-fade-slide-up`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FontAwesomeIcon icon={field.icon} className="mr-2 text-blue-500" />
                      {field.label}
                    </label>
                    {field.type === 'select' ? (
                      <Field
                        as="select"
                        name={field.name}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300"
                      >
                        {field.name === 'genero' ? (
                          <>
                            <option value="">Seleccione un género</option>
                            <option value="masculino">Masculino</option>
                            <option value="femenino">Femenino</option>
                            <option value="otro">Otro</option>
                          </>
                        ) : (
                          <>
                            <option value="">Seleccione una pregunta</option>
                            <option value="mascota">¿Cuál es el nombre de tu primera mascota?</option>
                            <option value="ciudad">¿En qué ciudad naciste?</option>
                            <option value="escuela">¿Cuál es el nombre de tu primera escuela?</option>
                            <option value="color">¿Cuál es tu color favorito?</option>
                          </>
                        )}
                      </Field>
                    ) : (
                      <Field
                        type={field.type}
                        name={field.name}
                        placeholder={`${field.label}...`}
                        onInput={field.onInput}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300"
                      />
                    )}
                  </div>
                ))}

                {/* Roles */}
                <div 
                  className="transform transition-all duration-300 animate-fade-slide-up"
                  style={{ animationDelay: '900ms' }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FontAwesomeIcon icon={faUserShield} className="mr-2 text-blue-500" />
                    Roles
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {['Administrador', 'Usuario', 'Editor'].map((rol) => (
                      <label 
                        key={rol}
                        className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-blue-50 cursor-pointer transition-colors duration-200"
                      >
                        <Field
                          type="checkbox"
                          name="roles"
                          value={rol.toLowerCase()}
                          className="form-checkbox h-5 w-5 text-blue-600"
                        />
                        <span className="text-gray-700">{rol}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Footer fijo */}
                <div className="relative overflow-hidden border-t border-gray-100 p-6 bg-gray-50 rounded-b-2xl flex-shrink-0 mt-6">
                  <div className="animate-shine absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-6 py-2.5 rounded-lg text-gray-700 hover:text-gray-900 bg-white border border-gray-200 hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow transform hover:scale-105"
                      disabled={isSubmitting}
                    >
                      <FontAwesomeIcon icon={faTimes} className="mr-2" />
                      <span>Cancelar</span>
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-lg text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-sm hover:shadow-lg transform hover:scale-105 disabled:opacity-50"
                      disabled={isSubmitting}
                    >
                      <FontAwesomeIcon 
                        icon={faSave} 
                        className={`mr-2 ${isSubmitting ? 'animate-spin' : ''}`} 
                      />
                      <span>{isSubmitting ? 'Guardando...' : editData ? 'Actualizar' : 'Guardar'}</span>
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>,
    document.body
  );
};

// Añadir estilos necesarios
const style = document.createElement('style');
style.textContent = `
  @keyframes modalIn {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(10px) rotateX(-10deg);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0) rotateX(0);
    }
  }

  @keyframes modalOut {
    from {
      opacity: 1;
      transform: scale(1) translateY(0) rotateX(0);
    }
    to {
      opacity: 0;
      transform: scale(0.95) translateY(10px) rotateX(10deg);
    }
  }

  @keyframes shine {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(100%);
    }
  }

  @keyframes fadeSlideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .perspective-1000 {
    perspective: 1000px;
  }

  .animate-modal-in {
    animation: modalIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .animate-modal-out {
    animation: modalOut 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .animate-shine {
    animation: shine 2s infinite;
  }

  .animate-fade-slide-up {
    animation: fadeSlideUp 0.5s ease-out forwards;
  }
`;
document.head.appendChild(style);

export default ModalUser;
