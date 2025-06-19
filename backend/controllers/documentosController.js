import documentosModel from "../models/documentos.js";
import { hashFileName, isValidFileType } from "../utils/hashUtils.js";
import { getFileUrl, getFilePath } from "../middleware/uploadMiddleware.js";
import fs from 'fs';
import path from 'path';

/*
EJEMPLO DE USO DEL CONTROLADOR DE DOCUMENTOS:

1. CREAR DOCUMENTO:
POST /api/documentos
Body: {
    "id_tipo": 1,
    "fecha_hora": "2024-01-15T10:30:00Z",
    "url": "https://ejemplo.com/documento.pdf",
    "descripcion": "Documento de trabajo"
}

2. SUBIR ARCHIVO FÍSICO:
POST /api/documentos/upload
FormData: {
    "file": [archivo],
    "id_tipo": 1,
    "fecha_hora": "2024-01-15T10:30:00Z",
    "descripcion": "Documento subido"
}

3. OBTENER TODOS LOS DOCUMENTOS:
GET /api/documentos

4. OBTENER DOCUMENTO POR ID:
GET /api/documentos/1

5. OBTENER DOCUMENTOS POR TIPO:
GET /api/documentos/tipo/1

6. DESCARGAR ARCHIVO:
GET /api/documentos/download/nombre_archivo.pdf

7. ACTUALIZAR DOCUMENTO:
PUT /api/documentos/1
Body: {
    "id_tipo": 2,
    "fecha_hora": "2024-01-15T11:00:00Z",
    "url": "https://ejemplo.com/documento_actualizado.pdf",
    "descripcion": "Documento actualizado"
}

8. ACTUALIZAR CON ARCHIVO:
PUT /api/documentos/1/upload
FormData: {
    "file": [archivo],
    "id_tipo": 2,
    "fecha_hora": "2024-01-15T11:00:00Z",
    "descripcion": "Documento actualizado"
}

9. ELIMINAR DOCUMENTO:
DELETE /api/documentos/1

10. CONTAR DOCUMENTOS:
GET /api/documentos/count

11. DOCUMENTOS CON PAGINACIÓN:
GET /api/documentos/paginated?page=1&limit=10

12. BUSCAR DOCUMENTOS:
GET /api/documentos/search?search=trabajo
*/

class DocumentosController {
    async createDocumento(req, res) {
        try {
            const { id_tipo, fecha_hora, originalFileName, url, descripcion } = req.body;

            // Validaciones básicas
            if (!id_tipo || !fecha_hora || !descripcion) {
                return res.status(400).json({
                    success: false,
                    message: "Los campos id_tipo, fecha_hora y descripcion son obligatorios"
                });
            }

            let finalUrl = null;
            let hashedFileName = null;
            let fileExtension = null;
            let mimeType = null;
            let originalName = null;

            // Caso 1: Si se proporciona originalFileName, hashearlo
            if (originalFileName) {
                originalName = originalFileName;
                
                // Validar tipo de archivo
                if (!isValidFileType(originalFileName)) {
                    return res.status(400).json({
                        success: false,
                        message: "Tipo de archivo no permitido"
                    });
                }

                // Generar nombre hasheado
                hashedFileName = hashFileName(originalFileName);
                
                // Obtener extensión manualmente
                const lastDotIndex = originalFileName.lastIndexOf('.');
                fileExtension = lastDotIndex === -1 ? '' : originalFileName.substring(lastDotIndex).toLowerCase();
                
                // Mapeo simple de tipos MIME
                const mimeTypes = {
                    '.pdf': 'application/pdf',
                    '.doc': 'application/msword',
                    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    '.xls': 'application/vnd.ms-excel',
                    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    '.txt': 'text/plain',
                    '.jpg': 'image/jpeg',
                    '.png': 'image/png'
                };
                mimeType = mimeTypes[fileExtension] || 'application/octet-stream';
                
                // Construir la URL hasheada
                finalUrl = `/docs/${hashedFileName}`;
            }
            // Caso 2: Si se proporciona url directamente, extraer nombre y hashearlo
            else if (url) {
                // Extraer el nombre del archivo de la URL
                const urlParts = url.split('/');
                const fileName = urlParts[urlParts.length - 1];
                
                if (fileName && fileName.includes('.')) {
                    originalName = fileName;
                    
                    // Validar tipo de archivo
                    if (!isValidFileType(fileName)) {
                        return res.status(400).json({
                            success: false,
                            message: "Tipo de archivo no permitido"
                        });
                    }

                    // Generar nombre hasheado
                    hashedFileName = hashFileName(fileName);
                    
                    // Obtener extensión
                    const lastDotIndex = fileName.lastIndexOf('.');
                    fileExtension = lastDotIndex === -1 ? '' : fileName.substring(lastDotIndex).toLowerCase();
                    
                    // Mapeo simple de tipos MIME
                    const mimeTypes = {
                        '.pdf': 'application/pdf',
                        '.doc': 'application/msword',
                        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                        '.xls': 'application/vnd.ms-excel',
                        '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        '.txt': 'text/plain',
                        '.jpg': 'image/jpeg',
                        '.png': 'image/png'
                    };
                    mimeType = mimeTypes[fileExtension] || 'application/octet-stream';
                    
                    // Construir la URL hasheada
                    finalUrl = `/docs/${hashedFileName}`;
                } else {
                    // Si no es un nombre de archivo válido, usar la URL tal como viene
                    finalUrl = url;
                }
            }

            const documento = await documentosModel.createDocumet({
                id_tipo,
                fecha_hora,
                url: finalUrl,
                descripcion
            });

            // Agregar información adicional al resultado
            const responseData = {
                ...documento,
                originalFileName: originalName,
                hashedFileName,
                fileExtension,
                mimeType
            };

            res.status(201).json({
                success: true,
                data: responseData,
                message: "Documento creado exitosamente"
            });
        } catch (error) {
            console.error("Error en createDocumento controller:", error.message);
            res.status(500).json({
                success: false,
                message: "Error al crear el documento",
                error: error.message
            });
        }
    }

    async getAllDocumentos(req, res) {
        try {
            const documentos = await documentosModel.findAll();

            res.status(200).json({
                success: true,
                data: documentos,
                message: "Documentos obtenidos exitosamente"
            });
        } catch (error) {
            console.error("Error en getAllDocumentos controller:", error.message);
            res.status(500).json({
                success: false,
                message: "Error al obtener los documentos",
                error: error.message
            });
        }
    }

    async getDocumentoById(req, res) {
        try {
            const { id } = req.params;
            const documento = await documentosModel.findById(id);

            if (!documento) {
                return res.status(404).json({
                    success: false,
                    message: "Documento no encontrado"
                });
            }

            res.status(200).json({
                success: true,
                data: documento,
                message: "Documento obtenido exitosamente"
            });
        } catch (error) {
            console.error("Error en getDocumentoById controller:", error.message);
            res.status(500).json({
                success: false,
                message: "Error al obtener el documento",
                error: error.message
            });
        }
    }

    async getDocumentosByTipo(req, res) {
        try {
            const { id_tipo } = req.params;
            const documentos = await documentosModel.findByTipo(id_tipo);

            res.status(200).json({
                success: true,
                data: documentos,
                message: "Documentos obtenidos exitosamente"
            });
        } catch (error) {
            console.error("Error en getDocumentosByTipo controller:", error.message);
            res.status(500).json({
                success: false,
                message: "Error al obtener los documentos por tipo",
                error: error.message
            });
        }
    }

    async updateDocumento(req, res) {
        try {
            const { id } = req.params;
            const { id_tipo, fecha_hora, originalFileName, url, descripcion } = req.body;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "ID de documento no proporcionado"
                });
            }

            // Verificar si el documento existe
            const documentoExistente = await documentosModel.findById(id);
            if (!documentoExistente) {
                return res.status(404).json({
                    success: false,
                    message: "Documento no encontrado"
                });
            }

            // Validaciones básicas
            if (!id_tipo || !fecha_hora || !descripcion) {
                return res.status(400).json({
                    success: false,
                    message: "Los campos id_tipo, fecha_hora y descripcion son obligatorios"
                });
            }

            let finalUrl = documentoExistente.url; // Mantener URL existente por defecto
            let hashedFileName = null;
            let fileExtension = null;
            let mimeType = null;
            let originalName = null;

            // Caso 1: Si se proporciona originalFileName, generar nuevo hash
            if (originalFileName) {
                originalName = originalFileName;
                
                // Validar tipo de archivo
                if (!isValidFileType(originalFileName)) {
                    return res.status(400).json({
                        success: false,
                        message: "Tipo de archivo no permitido"
                    });
                }

                // Generar nuevo nombre hasheado
                hashedFileName = hashFileName(originalFileName);
                
                // Obtener extensión manualmente
                const lastDotIndex = originalFileName.lastIndexOf('.');
                fileExtension = lastDotIndex === -1 ? '' : originalFileName.substring(lastDotIndex).toLowerCase();
                
                // Mapeo simple de tipos MIME
                const mimeTypes = {
                    '.pdf': 'application/pdf',
                    '.doc': 'application/msword',
                    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    '.xls': 'application/vnd.ms-excel',
                    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    '.txt': 'text/plain',
                    '.jpg': 'image/jpeg',
                    '.png': 'image/png'
                };
                mimeType = mimeTypes[fileExtension] || 'application/octet-stream';
                
                // Construir nueva URL hasheada
                finalUrl = `/docs/${hashedFileName}`;
            }
            // Caso 2: Si se proporciona url directamente, extraer nombre y hashearlo
            else if (url) {
                // Extraer el nombre del archivo de la URL
                const urlParts = url.split('/');
                const fileName = urlParts[urlParts.length - 1];
                
                if (fileName && fileName.includes('.')) {
                    originalName = fileName;
                    
                    // Validar tipo de archivo
                    if (!isValidFileType(fileName)) {
                        return res.status(400).json({
                            success: false,
                            message: "Tipo de archivo no permitido"
                        });
                    }

                    // Generar nombre hasheado
                    hashedFileName = hashFileName(fileName);
                    
                    // Obtener extensión
                    const lastDotIndex = fileName.lastIndexOf('.');
                    fileExtension = lastDotIndex === -1 ? '' : fileName.substring(lastDotIndex).toLowerCase();
                    
                    // Mapeo simple de tipos MIME
                    const mimeTypes = {
                        '.pdf': 'application/pdf',
                        '.doc': 'application/msword',
                        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                        '.xls': 'application/vnd.ms-excel',
                        '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        '.txt': 'text/plain',
                        '.jpg': 'image/jpeg',
                        '.png': 'image/png'
                    };
                    mimeType = mimeTypes[fileExtension] || 'application/octet-stream';
                    
                    // Construir la URL hasheada
                    finalUrl = `/docs/${hashedFileName}`;
                } else {
                    // Si no es un nombre de archivo válido, usar la URL tal como viene
                    finalUrl = url;
                }
            }

            const documentoActualizado = await documentosModel.update(id, {
                id_tipo,
                fecha_hora,
                url: finalUrl,
                descripcion
            });

            // Agregar información adicional si se actualizó el archivo
            const responseData = {
                ...documentoActualizado,
                originalFileName: originalName,
                hashedFileName,
                fileExtension,
                mimeType
            };

            res.status(200).json({
                success: true,
                data: responseData,
                message: "Documento actualizado exitosamente"
            });
        } catch (error) {
            console.error("Error en updateDocumento controller:", error.message);
            res.status(500).json({
                success: false,
                message: "Error al actualizar el documento",
                error: error.message
            });
        }
    }

    async deleteDocumento(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "ID de documento no proporcionado"
                });
            }

            // Verificar si el documento existe
            const documentoExistente = await documentosModel.findById(id);
            if (!documentoExistente) {
                return res.status(404).json({
                    success: false,
                    message: "Documento no encontrado"
                });
            }

            const documentoEliminado = await documentosModel.delete(id);

            res.status(200).json({
                success: true,
                data: documentoEliminado,
                message: "Documento eliminado exitosamente"
            });
        } catch (error) {
            console.error("Error en deleteDocumento controller:", error.message);
            res.status(500).json({
                success: false,
                message: "Error al eliminar el documento",
                error: error.message
            });
        }
    }

    async countDocumentos(req, res) {
        try {
            const total = await documentosModel.count();

            res.status(200).json({
                success: true,
                data: { total },
                message: "Conteo realizado exitosamente"
            });
        } catch (error) {
            console.error("Error en countDocumentos controller:", error.message);
            res.status(500).json({
                success: false,
                message: "Error al contar los documentos",
                error: error.message
            });
        }
    }

    async getDocumentosPaginated(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;

            // Obtener todos los documentos para el conteo
            const todosDocumentos = await documentosModel.findAll();
            const total = todosDocumentos.length;

            // Aplicar paginación
            const documentos = todosDocumentos.slice(offset, offset + limit);

            res.status(200).json({
                success: true,
                data: documentos,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                    hasNext: page < Math.ceil(total / limit),
                    hasPrev: page > 1
                },
                message: "Documentos obtenidos exitosamente"
            });
        } catch (error) {
            console.error("Error en getDocumentosPaginated controller:", error.message);
            res.status(500).json({
                success: false,
                message: "Error al obtener los documentos paginados",
                error: error.message
            });
        }
    }

    async searchDocumentos(req, res) {
        try {
            const { search } = req.query;

            if (!search) {
                return res.status(400).json({
                    success: false,
                    message: "El parámetro de búsqueda es requerido"
                });
            }

            // Obtener todos los documentos y filtrar por descripción
            const todosDocumentos = await documentosModel.findAll();
            const documentosFiltrados = todosDocumentos.filter(doc => 
                doc.descripcion.toLowerCase().includes(search.toLowerCase())
            );

            res.status(200).json({
                success: true,
                data: documentosFiltrados,
                message: "Búsqueda realizada exitosamente"
            });
        } catch (error) {
            console.error("Error en searchDocumentos controller:", error.message);
            res.status(500).json({
                success: false,
                message: "Error al buscar documentos",
                error: error.message
            });
        }
    }

    // Subir archivo físico
    async uploadDocumento(req, res) {
        try {
            const { id_tipo, fecha_hora, descripcion } = req.body;

            // Validaciones básicas
            if (!id_tipo || !fecha_hora || !descripcion) {
                return res.status(400).json({
                    success: false,
                    message: "Los campos id_tipo, fecha_hora y descripcion son obligatorios"
                });
            }

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "No se ha proporcionado ningún archivo"
                });
            }

            // Construir la URL del archivo
            const fileUrl = getFileUrl(req.file.filename);

            const documento = await documentosModel.createDocumet({
                id_tipo,
                fecha_hora,
                url: fileUrl,
                descripcion
            });

            // Agregar información adicional al resultado
            const responseData = {
                ...documento,
                originalFileName: req.file.originalname,
                hashedFileName: req.file.filename,
                fileSize: req.file.size,
                mimeType: req.file.mimetype
            };

            res.status(201).json({
                success: true,
                data: responseData,
                message: "Archivo subido exitosamente"
            });
        } catch (error) {
            console.error("Error en uploadDocumento controller:", error.message);
            res.status(500).json({
                success: false,
                message: "Error al subir el archivo",
                error: error.message
            });
        }
    }

    // Subir múltiples archivos
    async uploadMultipleDocumentos(req, res) {
        try {
            const { id_tipo, fecha_hora, descripcion } = req.body;

            // Validaciones básicas
            if (!id_tipo || !fecha_hora || !descripcion) {
                return res.status(400).json({
                    success: false,
                    message: "Los campos id_tipo, fecha_hora y descripcion son obligatorios"
                });
            }

            if (!req.files || req.files.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "No se han proporcionado archivos"
                });
            }

            const documentosCreados = [];

            for (const file of req.files) {
                const fileUrl = getFileUrl(file.filename);

                const documento = await documentosModel.createDocumet({
                    id_tipo,
                    fecha_hora,
                    url: fileUrl,
                    descripcion: `${descripcion} - ${file.originalname}`
                });

                documentosCreados.push({
                    ...documento,
                    originalFileName: file.originalname,
                    hashedFileName: file.filename,
                    fileSize: file.size,
                    mimeType: file.mimetype
                });
            }

            res.status(201).json({
                success: true,
                data: documentosCreados,
                message: `${documentosCreados.length} archivos subidos exitosamente`
            });
        } catch (error) {
            console.error("Error en uploadMultipleDocumentos controller:", error.message);
            res.status(500).json({
                success: false,
                message: "Error al subir los archivos",
                error: error.message
            });
        }
    }

    // Descargar archivo
    async downloadDocumento(req, res) {
        try {
            const { filename } = req.params;
            const filePath = getFilePath(filename);

            // Verificar si el archivo existe
            if (!fs.existsSync(filePath)) {
                return res.status(404).json({
                    success: false,
                    message: "Archivo no encontrado"
                });
            }

            // Enviar el archivo
            res.download(filePath, filename, (err) => {
                if (err) {
                    console.error("Error al descargar archivo:", err);
                    res.status(500).json({
                        success: false,
                        message: "Error al descargar el archivo"
                    });
                }
            });
        } catch (error) {
            console.error("Error en downloadDocumento controller:", error.message);
            res.status(500).json({
                success: false,
                message: "Error al descargar el archivo",
                error: error.message
            });
        }
    }

    // Actualizar documento con archivo físico
    async updateDocumentoWithFile(req, res) {
        try {
            const { id } = req.params;
            const { id_tipo, fecha_hora, descripcion } = req.body;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "ID de documento no proporcionado"
                });
            }

            // Verificar si el documento existe
            const documentoExistente = await documentosModel.findById(id);
            if (!documentoExistente) {
                return res.status(404).json({
                    success: false,
                    message: "Documento no encontrado"
                });
            }

            // Validaciones básicas
            if (!id_tipo || !fecha_hora || !descripcion) {
                return res.status(400).json({
                    success: false,
                    message: "Los campos id_tipo, fecha_hora y descripcion son obligatorios"
                });
            }

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "No se ha proporcionado ningún archivo"
                });
            }

            // Eliminar archivo anterior si existe
            if (documentoExistente.url) {
                const oldFilePath = getFilePath(documentoExistente.url.split('/').pop());
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }
            }

            // Construir nueva URL del archivo
            const fileUrl = getFileUrl(req.file.filename);

            const documentoActualizado = await documentosModel.update(id, {
                id_tipo,
                fecha_hora,
                url: fileUrl,
                descripcion
            });

            // Agregar información adicional al resultado
            const responseData = {
                ...documentoActualizado,
                originalFileName: req.file.originalname,
                hashedFileName: req.file.filename,
                fileSize: req.file.size,
                mimeType: req.file.mimetype
            };

            res.status(200).json({
                success: true,
                data: responseData,
                message: "Documento actualizado exitosamente"
            });
        } catch (error) {
            console.error("Error en updateDocumentoWithFile controller:", error.message);
            res.status(500).json({
                success: false,
                message: "Error al actualizar el documento",
                error: error.message
            });
        }
    }
}

export default new DocumentosController();
