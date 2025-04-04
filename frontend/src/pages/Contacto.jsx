export default function Contacto() {
    return (
      <div className="mt-6 bg-white/95 rounded-xl shadow-lg p-6 sm:p-8 space-y-6 border border-gray-200">
        <h1 className="text-3xl font-bold text-blue-600 border-b pb-2">Contacto</h1>
  
        <div className="space-y-3 text-gray-800 text-base leading-relaxed">
          <p>
            <span className="font-semibold">Dirección:</span> Calle Real de los Flores de Catia con calle Andrés Bello,
            Edif. Jesús Obrero, Los Flores de Catia, Parroquia Sucre, Distrito Capital, Caracas 1030.
          </p>
          <p>
            <span className="font-semibold">Teléfono:</span> (+58-412) 034 0692
          </p>
          <p>
            <span className="font-semibold">Correo Electrónico:</span> catiadireccion@iujo.edu.ve
          </p>
        </div>
  
        <div>
          <h2 className="text-xl font-semibold text-blue-600 mb-2">Ubicación Geográfica</h2>
          <div className="rounded-lg overflow-hidden border border-gray-300 shadow">
            <iframe
              className="w-full h-64"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3931.4937225785654!2d-66.95190518535217!3d10.512224292496314!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8c2a5fbe748dc5b1%3A0xb5e19a95e445449f!2sIUJO%20Los%20Flores%20de%20Catia!5e0!3m2!1ses-419!2sve!4v1712110659924!5m2!1ses-419!2sve"
              allowFullScreen=""
              loading="lazy"
              title="Mapa IUJO Catia"
            ></iframe>
          </div>
        </div>
      </div>
    );
  }
  