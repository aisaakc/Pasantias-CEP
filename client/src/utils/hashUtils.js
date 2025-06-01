export function encodeId(id) {
  try {
    if (id === undefined || id === null) {
      console.error('ID inválido para codificar:', id);
      return null;
    }
    const data = { id: id.toString() };
    return btoa(JSON.stringify(data));
  } catch (error) {
    console.error('Error al codificar ID:', error);
    return null;
  }
}

export function decodeId(encoded) {
  try {
    if (!encoded) {
      console.error('ID codificado inválido:', encoded);
      return null;
    }
    const decoded = atob(encoded);
    const parsed = JSON.parse(decoded);
    return parsed.id;
  } catch (error) {
    console.error('Error al decodificar ID:', error);
    return null;
  }
}

export function encodeParentId(parentId) {
  try {
    if (parentId === undefined) {
      return btoa(JSON.stringify({ parentId: null }));
    }
    return btoa(JSON.stringify({ parentId: parentId?.toString() || null }));
  } catch (error) {
    console.error('Error al codificar parentID:', error);
    return null;
  }
}

export function decodeParentId(encoded) {
  try {
    if (!encoded) {
      return null;
    }
    const decoded = atob(encoded);
    const parsed = JSON.parse(decoded);
    return parsed.parentId;
  } catch (error) {
    console.error('Error al decodificar parentID:', error);
    return null;
  }
}
  