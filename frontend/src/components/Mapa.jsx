// src/components/Mapa.jsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Mapa = () => {
  const position = [10.510556, -66.936944]; // Coordenadas del IUJO

  return (
    <div style={{ height: '400px', width: '100%', borderRadius: '10px' }}>
      <MapContainer center={position} zoom={17} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            Instituto Universitario Jesús Obrero (IUJO)<br />
            Calle Real de los Flores de Catia con calle Andrés Bello
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Mapa;
