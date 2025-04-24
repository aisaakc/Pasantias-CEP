// frontend/src/index.js (ejemplo)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // O tu archivo CSS principal
import { Provider } from 'react-redux';       // <-- Importa el Provider de Redux
import { store } from './app/store';         // <-- Importa tu store
import { BrowserRouter } from 'react-router-dom'; // <-- Importa BrowserRouter (si aún no está)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* --- CAMBIOS AQUÍ --- */}
    {/* Envuelve tu App con el Provider de Redux */}
    <Provider store={store}>
      {/* Asegúrate de que BrowserRouter también envuelva tu App */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
    {/* --- FIN CAMBIOS --- */}
  </React.StrictMode>,
);