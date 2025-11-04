package com.Oni3D.Controller;

import com.Oni3D.exception.StorageException;
import com.Oni3D.exception.StorageFileNotFoundException;
import com.Oni3D.repositorio.FileStorageService;
import com.Oni3D.repositorio.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import jakarta.servlet.http.HttpServletRequest; // Para detectar el tipo MIME
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/files") // Ruta base para archivos
@CrossOrigin(origins = "*") // Permitir peticiones desde cualquier origen (ajustar si es necesario)
public class FileController {

    private final FileStorageService fileStorageService;

    @Autowired
    public FileController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    /**
     * Endpoint para subir un archivo.
     * Recibe el archivo vía POST multipart/form-data.
     * Guarda el archivo usando FileStorageService y devuelve el nombre único generado.
     */
    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> handleFileUpload(@RequestParam("file") MultipartFile file) {

        // Validar que el archivo no esté vacío (aunque el servicio también lo hace)
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "El archivo está vacío"));
        }

        // Guardar el archivo y obtener su nombre único
        String filename = fileStorageService.store(file);

        // Opcional: Construir la URL completa para acceder al archivo (útil para el frontend)
        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/files/")
                .path(filename)
                .toUriString();

        // Devolver el nombre del archivo y la URL de descarga
        Map<String, String> response = new HashMap<>();
        response.put("filename", filename);
        response.put("url", fileDownloadUri);

        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint para servir/descargar un archivo guardado.
     * Recibe el nombre del archivo en la URL.
     * Carga el archivo como Resource y lo devuelve con el Content-Type adecuado.
     */
    @GetMapping("/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename, HttpServletRequest request) {

        Resource file = fileStorageService.loadAsResource(filename);

        // Intentar determinar el tipo de contenido del archivo
        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(file.getFile().getAbsolutePath());
        } catch (IOException ex) {
            System.err.println("No se pudo determinar el tipo de archivo.");
        }

        // Fallback a tipo genérico si no se puede determinar
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                // Opcional: añadir cabecera para forzar descarga (descomentar si se prefiere descargar en lugar de mostrar en navegador)
                // .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"")
                .body(file);
    }

    /**
     * Endpoint para eliminar un archivo (Opcional, pero útil).
     * Recibe el nombre del archivo en la URL.
     * Elimina el archivo usando FileStorageService.
     */
    @DeleteMapping("/{filename:.+}")
    public ResponseEntity<Map<String, Boolean>> deleteFile(@PathVariable String filename) {
        boolean deleted = fileStorageService.delete(filename);
        if (deleted) {
            return ResponseEntity.ok(Map.of("deleted", true));
        } else {
            // Podríamos devolver 404 si no se encontró o 500 si hubo otro error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("deleted", false));
        }
    }


    // --- Manejo de Excepciones Específicas del Controlador ---

    /**
     * Manejador para cuando no se encuentra un archivo solicitado para descarga.
     * Devuelve una respuesta 404 Not Found.
     */
    @ExceptionHandler(StorageFileNotFoundException.class)
    public ResponseEntity<?> handleStorageFileNotFound(StorageFileNotFoundException exc) {
        return ResponseEntity.notFound().build();
    }

    /**
     * Manejador general para otros errores de almacenamiento durante la subida/descarga.
     * Devuelve una respuesta 500 Internal Server Error.
     */
    @ExceptionHandler(StorageException.class)
    public ResponseEntity<?> handleStorageException(StorageException exc) {
        // Loggear el error sería buena idea aquí
        System.err.println("Error de almacenamiento: " + exc.getMessage());
        exc.printStackTrace(); // Para ver detalles en la consola
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error interno del servidor al procesar el archivo."));
    }
}
