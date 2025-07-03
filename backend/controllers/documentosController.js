import documentosModel from "../models/documentos.js";
import { hashFileName, isValidFileType, hashDeterministaPorId, getFileExtension } from "../utils/hashUtils.js";
import { getFileUrl, getFilePath } from "../middleware/uploadMiddleware.js";
import fs from 'fs';
import path from 'path';



class DocumentosController {
    async createDocumento(req, res) {
        try {
            const { id_tipo, fecha_hora, originalFileName, url, descripcion } = req.body;

            // Validaciones básicas
            if (!id_tipo || !fecha_hora) {
                return res.status(400).json({
                    success: false,
                    message: "Los campos id_tipo y fecha_hora son obligatorios"
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
                descripcion,
                tamano: req.file ? req.file.size : null
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
            if (!id_tipo || !fecha_hora) {
                return res.status(400).json({
                    success: false,
                    message: "Los campos id_tipo y fecha_hora son obligatorios"
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

            // En updateDocumento, si no se recibe ext en el body, usar el valor anterior de la BD
            const extValue = req.body.ext !== undefined ? req.body.ext : documentoExistente.ext;
            const documentoActualizado = await documentosModel.update(id, {
                id_tipo,
                fecha_hora,
                nombre: req.body.nombre,
                url: finalUrl,
                descripcion,
                ext: extValue,
                tamano: req.file ? req.file.size : null
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

            // Eliminar archivo físico si existe
            if (documentoExistente.url && documentoExistente.url.startsWith('/docs/')) {
                const filename = documentoExistente.url.split('/').pop();
                const filePath = getFilePath(filename);
                try {
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                } catch (err) {
                    console.error('Error al eliminar el archivo físico:', err.message);
                    // No retornamos error, solo lo registramos
                }
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

   

    // Subir archivo físico
    async uploadDocumento(req, res) {
        try {
            const { id_tipo, fecha_hora, descripcion, nombre } = req.body;

            // Validaciones básicas
            if (!id_tipo || !fecha_hora) {
                return res.status(400).json({
                    success: false,
                    message: "Los campos id_tipo y fecha_hora son obligatorios"
                });
            }

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "No se ha proporcionado ningún archivo"
                });
            }

            // Obtener extensión (sin punto, minúsculas)
            const ext = getFileExtension(req.file.originalname);
            const extWithDot = ext ? '.' + ext : '';

            // LOG: Datos recibidos
            console.log('--- uploadDocumento LOG ---');
            console.log('req.file:', req.file);
            console.log('Campos body:', { id_tipo, fecha_hora, descripcion, nombre });
            console.log('Extensión:', ext);

            // 1. Guardar registro con el nombre del documento (input del usuario) y extensión
            let documento = await documentosModel.createDocumet({
                id_tipo,
                fecha_hora,
                nombre, // nombre del input del modal
                descripcion,
                ext,
                tamano: req.file.size // tamaño en bytes
            });
            console.log('Documento insertado en BD:', documento);

            // 2. Generar hash determinista por id
            const hashedName = hashDeterministaPorId(documento.id_documento) + extWithDot;
            console.log('Nombre hasheado:', hashedName);

            // 3. Renombrar archivo físico
            const docsPath = req.file.destination;
            const oldPath = path.join(docsPath, req.file.filename);
            const newPath = path.join(docsPath, hashedName);
            console.log('docsPath:', docsPath);
            console.log('oldPath:', oldPath);
            console.log('newPath:', newPath);
            fs.renameSync(oldPath, newPath);
            console.log('Archivo renombrado correctamente');

            // 4. No actualizar el campo nombre, solo el archivo físico se renombra

            // 5. Responder
            res.status(201).json({
                success: true,
                data: documento,
                message: "Archivo subido exitosamente"
            });
        } catch (error) {
            console.error("Error en uploadDocumento controller:", error);
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
            if (!id_tipo || !fecha_hora) {
                return res.status(400).json({
                    success: false,
                    message: "Los campos id_tipo y fecha_hora son obligatorios"
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
                const documento = await documentosModel.createDocumet({
                    id_tipo,
                    fecha_hora,
                    nombre: file.filename,
                    descripcion: `${descripcion} - ${file.originalname}`,
                    ext: file.originalname.split('.').pop(),
                    tamano: file.size
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
            if (!id_tipo || !fecha_hora) {
                return res.status(400).json({
                    success: false,
                    message: "Los campos id_tipo y fecha_hora son obligatorios"
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
            const ext = req.file.originalname.split('.').pop().toLowerCase();
            const extWithDot = ext ? '.' + ext : '';
            const hashedName = hashDeterministaPorId(id) + extWithDot;
            const docsPath = req.file.destination;
            const oldPath = path.join(docsPath, req.file.filename);
            const newPath = path.join(docsPath, hashedName);
            fs.renameSync(oldPath, newPath);

            const fileUrl = `/docs/${hashedName}`;

            const documentoActualizado = await documentosModel.update(id, {
                id_tipo,
                fecha_hora,
                nombre: req.body.nombre,
                descripcion,
                ext,
                url: fileUrl,
                tamano: req.file.size
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

    async getByIds(req, res) {
        try {
            const { ids } = req.body;
            if (!Array.isArray(ids)) {
                return res.status(400).json({ success: false, message: 'IDs inválidos' });
            }
            const documentos = await documentosModel.findByIds(ids);
            res.status(200).json({ success: true, data: documentos });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

export default new DocumentosController();
