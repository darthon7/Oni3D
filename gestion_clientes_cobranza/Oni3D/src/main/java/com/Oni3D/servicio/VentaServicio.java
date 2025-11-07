package com.Oni3D.servicio;

import com.Oni3D.model.Venta;
import com.Oni3D.model.EstadoVenta;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface VentaServicio {

    // Crear venta desde un evento
    Venta registrarVentaDesdeEvento(Long eventoId);

    // Obtener venta por ID
    Optional<Venta> obtenerVentaPorId(Long id);

    // Obtener venta por evento
    Optional<Venta> obtenerVentaPorEvento(Long eventoId);

    // Listar todas las ventas
    List<Venta> obtenerTodasLasVentas();

    // Listar ventas por producto
    List<Venta> obtenerVentasPorProducto(Long productoId);

    // Listar ventas por cliente
    List<Venta> obtenerVentasPorCliente(Long clienteId);

    // Listar ventas por estado
    List<Venta> obtenerVentasPorEstado(EstadoVenta estado);

    // Listar ventas en rango de fechas
    List<Venta> obtenerVentasEnPeriodo(LocalDateTime inicio, LocalDateTime fin);

    // Actualizar estado de venta
    Venta actualizarEstadoVenta(Long ventaId, EstadoVenta nuevoEstado);

    // Eliminar venta
    void eliminarVenta(Long ventaId);

    // ⭐ AGREGAR ESTE MÉTODO ⭐
    void eliminarVentaPorEventoId(Long eventoId);

    // Estadísticas
    Double calcularTotalVendidoPorProducto(Long productoId);
    Double calcularTotalVendidoEnPeriodo(LocalDateTime inicio, LocalDateTime fin);
    Integer calcularCantidadVendidaPorProducto(Long productoId);
}