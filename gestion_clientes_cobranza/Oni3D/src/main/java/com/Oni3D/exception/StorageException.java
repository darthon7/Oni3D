package com.Oni3D.exception;

/**
 * Excepción base para errores relacionados con el almacenamiento de archivos.
 */
public class StorageException extends RuntimeException {

  public StorageException(String message) {
    super(message);
  }

  public StorageException(String message, Throwable cause) {
    super(message, cause);
  }
}

