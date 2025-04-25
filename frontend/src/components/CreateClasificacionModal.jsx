import React, { useState, useRef, useEffect } from 'react';
// Podríamos importar hooks de Redux aquí más adelante si manejamos el estado de creación con Redux

// Este componente es una modal reutilizable para crear una clasificación
function CreateClasificacionModal({ isOpen, onClose, onCreate }) {
  // Estado local para los campos del formulario
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  // Podemos añadir más estados para otros campos como type_id, parent_id, etc. si es necesario

  const modalRef = useRef(null);

  // Efecto para controlar la visibilidad de la modal usando los métodos del elemento <dialog>
  useEffect(() => {
    const modalElement = modalRef.current;
    if (modalElement) {
      if (isOpen) {
        modalElement.showModal(); // Abre la modal
      } else {
        modalElement.close(); // Cierra la modal
      }
    }
  }, [isOpen]); // Este efecto se ejecuta cada vez que cambia la prop 'isOpen'

  // Manejar el envío del formulario
  const handleSubmit = async (event) => {
    event.preventDefault(); // Previene el comportamiento por defecto del formulario

    // Validar datos si es necesario
    if (!nombre) {
        alert('El nombre es obligatorio.'); // Validación simple
        return;
    }

    // Crear el objeto con los datos de la nueva clasificación
    const nuevaClasificacion = {
      nombre,
      descripcion,
      // Añade aquí otros campos si el formulario los tiene
    };

    // Llamar a la función 'onCreate' que se pasará desde el componente padre.
    // Esta función se encargará de la lógica de creación (llamada API, dispatch de Redux).
    await onCreate(nuevaClasificacion);

    // Limpiar el formulario y cerrar la modal después de la creación (si es exitosa, la lógica de cierre
    // podría estar en el padre después de que el thunk de Redux termine con éxito)
    setNombre('');
    setDescripcion('');
    // onClose(); // El padre debería encargarse de cerrar la modal después de la creación exitosa o manejar el estado
  };

   // Manejar el cierre de la modal cuando se interactúa con el elemento <dialog> (ESC key, click fuera)
   const handleCloseModal = () => {
       // Llama a la función onClose que se pasa desde el padre
       // Esto actualizará el estado en el padre y cerrará la modal.
       onClose();
       // Opcional: Limpiar el formulario al cerrar si no se hizo antes
       // setNombre('');
       // setDescripcion('');
   };


  return (
    // Usamos el elemento nativo <dialog>
    <dialog id="create_clasificacion_modal" className="modal" ref={modalRef} onClose={handleCloseModal}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Crear Nueva Clasificación</h3>

        <form onSubmit={handleSubmit} className="py-4">
          {/* Campo Nombre */}
          <div className="mb-4">
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre:</label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required // Campo requerido
            />
          </div>

          {/* Campo Descripción (opcional) */}
          <div className="mb-4">
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">Descripción:</label>
            <textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows="3"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            ></textarea>
          </div>

          {/* Aquí podrías añadir campos para type_id, parent_id, etc. si la creación lo requiere */}
          {/* Por ejemplo, un selector para el type_id, que podrías cargar usando un thunk similar */}


          <div className="modal-action">
            {/* Botón de Cierre (usando form method="dialog" para cerrar automáticamente al hacer clic) */}
            {/* Este botón cierra la modal sin enviar el formulario */}
             <button type="button" className="btn" onClick={onClose}>Cancelar</button>

            {/* Botón de Envío del Formulario */}
            <button type="submit" className="btn btn-primary">Crear</button>

             {/* Si manejas la carga de la creación con Redux, podrías deshabilitar el botón y mostrar un spinner aquí */}
             {/* {isLoadingCreation && <span className="loading loading-spinner"></span>} */}

          </div>
        </form>
      </div>

      {/* Este form con method="dialog" es para permitir cerrar la modal haciendo clic fuera de modal-box */}
      {/* Asegúrate de que el fondo oscuro de la modal (modal-backdrop) esté presente */}
      <form method="dialog" className="modal-backdrop" onClick={onClose}>
         <button>close</button> {/* Este botón está oculto pero es necesario para que el backdrop cierre la modal */}
      </form>

    </dialog>
  );
}

export default CreateClasificacionModal;