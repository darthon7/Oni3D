package com.Oni3D.servicio;

import com.Oni3D.exception.StorageException;
import com.Oni3D.exception.StorageFileNotFoundException;
import com.Oni3D.repositorio.FileStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.FileSystemUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils; // <--- IMPORTANTE: Añadir esta importación

import jakarta.annotation.PostConstruct; // Importar PostConstruct
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID; // Para nombres únicos
import java.util.stream.Stream;

@Service
public class FileSystemStorageService implements FileStorageService {

    @Value("${file.upload-dir:./uploads}") // Leer la propiedad o usar './uploads' por defecto
    private String uploadDir;

    private Path rootLocation;

    @Override
    @PostConstruct // Asegura que init() se llame después de la inyección de dependencias
    public void init() {
        try {
            // Resolvemos a ruta absoluta desde el inicio para consistencia
            this.rootLocation = Paths.get(uploadDir).toAbsolutePath().normalize();

            if (Files.notExists(rootLocation)) {
                Files.createDirectories(rootLocation);
                System.out.println("Directorio de subida creado en: " + rootLocation); // Ya es absoluto
            } else {
                System.out.println("Usando directorio de subida existente: " + rootLocation); // Ya es absoluto
            }
        }
        catch (IOException e) {
            throw new StorageException("No se pudo inicializar el directorio de almacenamiento en " + uploadDir, e);
        }
    }

    @Override
    public String store(MultipartFile file) {
        // Asegurarse que rootLocation esté inicializado
        if (this.rootLocation == null) {
            throw new StorageException("El servicio de almacenamiento no está inicializado correctamente.");
        }

        try {
            if (file == null || file.isEmpty()) {
                throw new StorageException("No se puede guardar un archivo nulo o vacío.");
            }

            // 1. Limpiar el nombre original del archivo
            String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
            if (originalFilename == null || originalFilename.isBlank() || originalFilename.contains("..")) {
                throw new StorageException("Nombre de archivo inválido o contiene secuencia de ruta relativa: " + file.getOriginalFilename());
            }

            // 2. Generar un nombre de archivo único
            String fileExtension = "";
            int lastDot = originalFilename.lastIndexOf('.');
            if (lastDot >= 0) { // Usar >= 0 por si el archivo empieza con '.'
                fileExtension = originalFilename.substring(lastDot);
            }
            String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

            // 3. Resolver la ruta de destino DENTRO del rootLocation
            Path destinationFile = this.rootLocation.resolve(uniqueFilename)
                    .normalize() // Normalizar ruta (eliminar '.')
                    .toAbsolutePath(); // Asegurar que sea absoluta

            // --- CORRECCIÓN/MEJORA EN LA COMPROBACIÓN DE SEGURIDAD ---
            // Verificar que la ruta de destino normalizada COMIENCE CON la ruta raíz normalizada
            if (!destinationFile.startsWith(this.rootLocation)) {
                // Esto no debería ocurrir si cleanPath y resolve funcionan bien, pero es una buena doble verificación
                System.err.println("Error de seguridad: Intento de guardar archivo fuera del directorio raíz.");
                System.err.println("   Directorio Raíz: " + this.rootLocation);
                System.err.println("   Archivo Destino: " + destinationFile);
                throw new StorageException("No se puede guardar el archivo fuera del directorio raíz configurado.");
            }
            // --- FIN CORRECCIÓN ---

            // 4. Copiar el archivo al destino
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
                System.out.println("Archivo guardado como: " + destinationFile);
                return uniqueFilename; // Devolver el nombre único generado
            }
        }
        catch (IOException e) {
            System.err.println("Error de IO al guardar archivo: " + e.getMessage());
            throw new StorageException("Error al guardar el archivo.", e);
        }
        catch (StorageException e) {
            // Re-lanzar excepciones de almacenamiento específicas (como nombre inválido)
            System.err.println("Error de Almacenamiento: " + e.getMessage());
            throw e;
        }
        catch (Exception e) {
            // Capturar cualquier otra excepción inesperada
            System.err.println("Error inesperado al guardar archivo: " + e.getMessage());
            throw new StorageException("Error inesperado al guardar el archivo.", e);
        }
    }


    @Override
    public Stream<Path> loadAll() {
        if (this.rootLocation == null) {
            throw new StorageException("El servicio de almacenamiento no está inicializado.");
        }
        try {
            return Files.walk(this.rootLocation, 1)
                    .filter(path -> !path.equals(this.rootLocation))
                    .map(this.rootLocation::relativize);
        }
        catch (IOException e) {
            throw new StorageException("Error al leer los archivos almacenados", e);
        }
    }

    @Override
    public Path load(String filename) {
        if (this.rootLocation == null) {
            throw new StorageException("El servicio de almacenamiento no está inicializado.");
        }
        // Limpiar filename por seguridad antes de resolverlo
        String cleanedFilename = StringUtils.cleanPath(filename);
        if (cleanedFilename.contains("..")) {
            throw new StorageException("Nombre de archivo inválido contiene secuencia de ruta relativa: " + filename);
        }
        return rootLocation.resolve(cleanedFilename);
    }

    @Override
    public Resource loadAsResource(String filename) {
        try {
            Path file = load(filename); // load ya limpia el nombre y maneja inicialización
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            }
            else {
                System.err.println("Intento de leer archivo no existente o no legible: " + filename + " en ruta: " + file.toAbsolutePath());
                throw new StorageFileNotFoundException("No se pudo leer el archivo: " + filename);
            }
        }
        catch (MalformedURLException e) {
            throw new StorageFileNotFoundException("No se pudo leer el archivo (URL mal formada): " + filename, e);
        }
        catch (StorageException e) { // Re-lanzar excepciones específicas de load()
            throw e;
        }
    }

    @Override
    public boolean delete(String filename) {
        if (this.rootLocation == null) {
            System.err.println("Intento de eliminar sin servicio inicializado.");
            return false; // O lanzar excepción
        }
        try {
            Path file = load(filename); // load ya limpia el nombre
            // Validar que el archivo esté DENTRO del directorio raíz antes de borrar
            // Usamos startsWith en rutas absolutas y normalizadas
            if (!file.toAbsolutePath().normalize().startsWith(this.rootLocation)) {
                System.err.println("Intento de eliminar archivo fuera del directorio raíz: " + filename);
                return false; // No lanzar excepción, solo indicar que no se borró
            }

            boolean deleted = Files.deleteIfExists(file);

            if (deleted) {
                System.out.println("Archivo eliminado: " + filename);
            } else {
                System.out.println("Archivo no encontrado para eliminar (o ya había sido eliminado): " + filename);
            }
            return deleted; // Devolver el resultado

        } catch (IOException e) {
            System.err.println("Error de IO al intentar eliminar archivo: " + filename + " - " + e.getMessage());
            return false;
        }
        catch (StorageException e) { // Capturar errores de load()
            System.err.println("Error de almacenamiento al intentar eliminar: " + e.getMessage());
            return false;
        }
    }


    @Override
    public void deleteAll() {
        if (this.rootLocation == null) {
            System.err.println("Intento de deleteAll sin servicio inicializado.");
            return; // O lanzar excepción
        }
        try {
            System.out.println("Eliminando todos los archivos en: " + rootLocation);
            Files.walk(this.rootLocation, 1)
                    .filter(path -> !path.equals(this.rootLocation))
                    .forEach(path -> {
                        try {
                            // Borrar archivos y directorios vacíos dentro de uploads
                            if (Files.isDirectory(path)) {
                                FileSystemUtils.deleteRecursively(path);
                            } else {
                                Files.delete(path);
                            }
                        } catch (IOException e) {
                            System.err.println("No se pudo eliminar: " + path + " - " + e.getMessage());
                        }
                    });
        } catch (IOException e) {
            throw new StorageException("No se pudieron eliminar todos los archivos.", e);
        }
    }
}

