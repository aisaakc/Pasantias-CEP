export function encodeId(id) {
    return btoa(JSON.stringify({ id }));
  }
  
  export function decodeId(encoded) {
    try {
      const decoded = atob(encoded);
      const parsed = JSON.parse(decoded);
      return parsed.id;
    } catch (error) {
      console.error("Error al decodificar ID:", error);
      return null;
    }
  }
  