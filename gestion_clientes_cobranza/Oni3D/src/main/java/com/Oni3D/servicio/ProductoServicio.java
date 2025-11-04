package com.Oni3D.servicio;
import com.Oni3D.model.Producto;
import java.util.List;
import java.util.Optional;

public interface ProductoServicio {

    List<Producto> findAll();

    Optional<Producto> findById(Long id);

    Producto save(Producto producto);

    Producto update(Long id, Producto producto);

    void deleteById(Long id);

    List<Producto> findByDescripcionContaining(String texto);

    List<Producto> findByPrecioBetween(Double minPrecio, Double maxPrecio);

    /**
     * Actualiza el stock de forma directa (fija un nuevo valor).
     * @return filas afectadas
     */
    int updateStockById(Long id, Integer nuevoStock);

    /**
     * Decrementa stock si hay suficiente cantidad disponible.
     * @return filas afectadas (1 si se decrementó, 0 si no hay suficiente stock)
     */
    int decreaseStockIfAvailable(Long id, Integer cantidad);
}
