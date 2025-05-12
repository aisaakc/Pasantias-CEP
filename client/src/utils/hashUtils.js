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

  export function encodeParentId(parentId) {
    console.log("encodeParentId: "+parentId);
    if (parentId) return btoa(JSON.stringify({ parentId }));
    return btoa(JSON.stringify({ parentId: null }));
  }

  export function decodeParentId(encoded) {
    if (encoded && encoded !== undefined) console.log("decodeParentId: "+atob(encoded));
    try {
      if (encoded === undefined) return null;
      const decoded = atob(encoded);
      const parsed = JSON.parse(decoded);
      return parsed.parentId;
    } catch (error) {
      console.error("Error al decodificar parentID:", error);
      return null;
    }
  }
  