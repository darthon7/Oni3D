package com.Oni3D.repositorio;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.util.stream.Stream;

/**
 * Interfaz para definir las operaciones de almacenamiento de archivos.
 */
public interface FileStorageService {

    /**
     * Inicializa el directorio de almacenamiento.
     */
    void init();

    /**
     * Guarda un archivo subido.
     * @param file El archivo MultipartFile recibido.
     * @return El nombre único del archivo guardado.
     */
    String store(MultipartFile file);

    /**
     * Carga todos los archivos como un Stream de Paths.
     * @return Stream de Paths.
     */
    Stream<Path> loadAll();

    /**
     * Carga un archivo específico como Path.
     * @param filename El nombre del archivo a cargar.
     * @return Path al archivo.
     */
    Path load(String filename);

    /**
     * Carga un archivo específico como Resource (para servirlo).
     * @param filename El nombre del archivo.
     * @return El archivo como Resource.
     */
    Resource loadAsResource(String filename);

    /**
     * Elimina todos los archivos del directorio de almacenamiento (usar con precaución).
     */
    void deleteAll();

    /**
     * Elimina un archivo específico.
     * @param filename El nombre del archivo a eliminar.
     * @return true si se eliminó, false en caso contrario.
     */
    boolean delete(String filename);

}
