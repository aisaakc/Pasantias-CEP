import React from 'react';
import 'font-awesome/css/font-awesome.min.css'; // Importa los estilos de Font Awesome

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-auto">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="flex flex-col items-center justify-center">
          <div className="mb-4 text-center">
            <h3 className="text-lg font-semibold mb-4 text-indigo-400">Síguenos</h3>
            <div className="flex justify-center space-x-6">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-indigo-500 transition duration-300"
              >
                <i className="fa fa-facebook-f icon-size"></i> 
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-indigo-500 transition duration-300"
              >
                <i className="fa fa-twitter icon-size"></i> 
              </a>
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-indigo-500 transition duration-300"
              >
                <i className="fa fa-linkedin icon-size"></i> 
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-indigo-500 transition duration-300"
              >
                <i className="fa fa-instagram icon-size"></i> 
              </a>
            </div>
          </div>
        </div>
        <div className="mt-6 border-t border-gray-700 pt-4">
          <p className="text-center text-sm text-gray-400">
            © 2025 IUJO. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
