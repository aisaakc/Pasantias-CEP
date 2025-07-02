// // src/components/Mapa.jsx
// import React from 'react';
// import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// // Fix for default marker icon
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
//   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// });

// // Custom marker icon
// const customIcon = new L.Icon({
//   iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41]
// });

// const Mapa = () => {
//   const position = [10.510556, -66.936944]; // Coordenadas del IUJO

//   return (
//     <div style={{ height: '100%', width: '100%', borderRadius: '10px' }}>
//       <MapContainer 
//         center={position} 
//         zoom={17} 
//         style={{ height: '100%', width: '100%' }}
//         zoomControl={false}
//         className="map-container"
//       >
//         <TileLayer
//           url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
//         />
//         <ZoomControl position="bottomright" />
//         <Marker position={position} icon={customIcon}>
//           <Popup>
//             <div className="p-2">
//               <h3 className="font-bold text-lg text-blue-600 mb-2">Instituto Universitario Jesús Obrero (IUJO)</h3>
//               <p className="text-gray-700">Calle Real de los Flores de Catia con calle Andrés Bello</p>
//             </div>
//           </Popup>
//         </Marker>
//       </MapContainer>
//     </div>
//   );
// };

// export default Mapa;
