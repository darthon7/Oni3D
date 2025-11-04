package com.Oni3D.repositorio;

import com.Oni3D.model.Venta;
import com.Oni3D.model.EstadoVenta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface VentaRepositorio extends JpaRepository<Venta, Long> {

    // Buscar venta por evento
    Optional<Venta> findByEventoId(Long eventoId);

    // Listar ventas por producto
    List<Venta> findByProductoIdProducto(Long productoId);

    // Listar ventas por cliente
    List<Venta> findByClienteIdEmpleado(Long clienteId);

    // Listar ventas por estado
    List<Venta> findByEstado(EstadoVenta estado);

    // Listar ventas en rango de fechas
    List<Venta> findByFechaVentaBetween(LocalDateTime inicio, LocalDateTime fin);

    // Buscar ventas por producto y fecha
    List<Venta> findByProductoIdProductoAndFechaVentaBetween(
            Long productoId, LocalDateTime inicio, LocalDateTime fin);

    // Buscar ventas por cliente y fecha
    List<Venta> findByClienteIdEmpleadoAndFechaVentaBetween(
            Long clienteId, LocalDateTime inicio, LocalDateTime fin);

    // Query personalizada para obtener total vendido por producto
    @Query("SELECT SUM(v.total) FROM Venta v WHERE v.producto.idProducto = :productoId")
    Double calcularTotalVendidoPorProducto(@Param("productoId") Long productoId);

    // Query para obtener total vendido en rango de fechas
    @Query("SELECT SUM(v.total) FROM Venta v WHERE v.fechaVenta BETWEEN :inicio AND :fin")
    Double calcularTotalVendidoEnPeriodo(
            @Param("inicio") LocalDateTime inicio,
            @Param("fin") LocalDateTime fin);

    // Query para obtener cantidad vendida de un producto
    @Query("SELECT SUM(v.cantidad) FROM Venta v WHERE v.producto.idProducto = :productoId")
    Integer calcularCantidadVendidaPorProducto(@Param("productoId") Long productoId);
}