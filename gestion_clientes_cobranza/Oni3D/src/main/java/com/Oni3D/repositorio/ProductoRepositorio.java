package com.Oni3D.repositorio;

import com.Oni3D.model.Producto;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

// Añadir la anotación @Repository es una buena práctica aunque Spring Data JPA lo detecta
@org.springframework.stereotype.Repository
public interface ProductoRepositorio extends JpaRepository<Producto, Long> {

    // Buscar por texto en la descripción (case-insensitive)
    List<Producto> findByDescripcionContainingIgnoreCase(String descripcion);

    // Buscar por rango de precio
    List<Producto> findByPrecioBetween(Double minPrecio, Double maxPrecio);

    // Ejemplo JPQL para fijar stock (retorna número de filas afectadas)
    @Modifying
    @Transactional
    @Query("UPDATE Producto p SET p.stock = :stock WHERE p.idProducto = :id")
    int updateStockById(@Param("id") Long id, @Param("stock") Integer stock);

    // Ejemplo: decrementar stock si hay suficiente (retorna filas afectadas)
    @Modifying
    @Transactional
    @Query("UPDATE Producto p SET p.stock = p.stock - :cantidad WHERE p.idProducto = :id AND p.stock >= :cantidad")
    int decreaseStockIfAvailable(@Param("id") Long id, @Param("cantidad") Integer cantidad);
}
