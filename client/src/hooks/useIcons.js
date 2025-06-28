import { useEffect } from 'react';
import useClasificacionStore from '../store/clasificacionStore';

/**
 * Hook personalizado para manejar iconos con caché global
 * @returns {Object} Objeto con iconos, estado de carga y métodos
 */
const useIcons = () => {
  const { 
    icons, 
    iconsLoaded, 
    iconsLoading, 
    getIcons, 
    areIconsLoaded, 
    preloadIcons 
  } = useClasificacionStore();

  // Precargar iconos si no están cargados
  useEffect(() => {
    if (!areIconsLoaded() && !iconsLoading) {
      preloadIcons();
    }
  }, [areIconsLoaded, iconsLoading, preloadIcons]);

  return {
    icons: getIcons(),
    isLoading: iconsLoading,
    isLoaded: iconsLoaded,
    preloadIcons,
    getIcons
  };
};

export default useIcons; 