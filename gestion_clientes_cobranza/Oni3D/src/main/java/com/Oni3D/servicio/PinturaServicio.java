package com.Oni3D.servicio;

import com.Oni3D.model.Pintura;
import java.util.List;
import java.util.Optional;

/**
 * Interfaz para el servicio de gestión de Stock de Pinturas.
 * Define el contrato para las operaciones de negocio.
 */
public interface PinturaServicio {

    /**
     * Obtiene una lista de todas las pinturas en el stock.
     * @return Lista de todas las pinturas.
     */
    List<Pintura> obtenerTodasLasPinturas();

    /**
     * Busca una pintura específica por su ID.
     * @param id El ID de la pintura.
     * @return Un Optional que contiene la pintura si se encuentra.
     */
    Optional<Pintura> obtenerPinturaPorId(Long id);

    /**
     * Guarda una nueva pintura en la base de datos.
     * @param pintura El objeto Pintura a guardar.
     * @return La pintura guardada (con el ID asignado).
     */
    Pintura guardarPintura(Pintura pintura);

    /**
     * Actualiza una pintura existente.
     * @param id El ID de la pintura a actualizar.
     * @param detallesPintura Un objeto Pintura con la nueva información.
     * @return La pintura actualizada.
     */
    Pintura actualizarPintura(Long id, Pintura detallesPintura);

    /**
     * Elimina una pintura de la base de datos.
     * @param id El ID de la pintura a eliminar.
     */
    void eliminarPintura(Long id);

    // --- Métodos de búsqueda (basados en el Repositorio) ---

    /**
     * Busca pinturas por marca (ignorando mayúsculas/minúsculas).
     * @param marca La marca a buscar.
     * @return Lista de pinturas que coinciden.
     */
    List<Pintura> buscarPorMarca(String marca);

    /**
     * Busca pinturas por color (ignorando mayúsculas/minúsculas).
     * @param color El color a buscar.
     * @return Lista de pinturas que coinciden.
     */
    List<Pintura> buscarPorColor(String color);

    /**
     * Busca pinturas por marca Y color.
     * @param marca La marca a buscar.
     * @param color El color a buscar.
     * @return Lista de pinturas que coinciden.
     */
    List<Pintura> buscarPorMarcaYColor(String marca, String color);
}
