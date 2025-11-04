package com.Oni3D.exception;

/**
 * Excepción lanzada cuando no se encuentra un archivo específico en el almacenamiento.
 */
public class StorageFileNotFoundException extends StorageException {

    public StorageFileNotFoundException(String message) {
        super(message);
    }

    public StorageFileNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}

