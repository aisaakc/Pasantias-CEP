import express from "express";
import documentosController from "../controllers/documentosController.js";
import { uploadSingle, uploadMultiple, handleUploadError, configureUploadLimits } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Rutas para documentos
router.post("/", documentosController.createDocumento); // Crear documento

// Configurar límites específicos solo para las rutas de subida de archivos
router.post("/upload", 
    configureUploadLimits,
    uploadSingle, 
    handleUploadError, 
    documentosController.uploadDocumento
); // Subir archivo físico

router.post("/upload-multiple", 
    configureUploadLimits,
    uploadMultiple, 
    handleUploadError, 
    documentosController.uploadMultipleDocumentos
); // Subir múltiples archivos

router.get("/", documentosController.getAllDocumentos); // Obtener todos los documentos
router.get("/tipo/:id_tipo", documentosController.getDocumentosByTipo); // Documentos por tipo
router.get("/count", documentosController.countDocumentos); // Contar documentos

router.get("/download/:filename", documentosController.downloadDocumento); // Descargar archivo
router.put("/:id", documentosController.updateDocumento); // Actualizar documento

router.put("/:id/upload", 
    configureUploadLimits,
    uploadSingle, 
    handleUploadError, 
    documentosController.updateDocumentoWithFile
); // Actualizar con archivo

router.delete("/:id", documentosController.deleteDocumento); // Eliminar documento

export default router;

