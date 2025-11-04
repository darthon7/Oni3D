package com.Oni3D.Controller;

import com.Oni3D.model.EstadoVenta;
import com.Oni3D.model.Venta;
import com.Oni3D.servicio.VentaServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ventas")
@CrossOrigin(origins = "http://localhost:5173")
public class VentaController {

    @Autowired
    private VentaServicio ventaServicio;

    /**
     * Endpoint para registrar una venta desde un evento existente.
     * POST /api/ventas/registrar/{eventoId}
     */
    @PostMapping("/registrar/{eventoId}")
    public ResponseEntity<Map<String, Object>> registrarVenta(@PathVariable Long eventoId) {
        Map<String, Object> response = new HashMap<>();
        try {
            Venta venta = ventaServicio.registrarVentaDesdeEvento(eventoId);
            response.put("success", true);
            response.put("message", "Venta registrada exitosamente");
            response.put("venta", venta);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Obtener todas las ventas.
     * GET /api/ventas
     */
    @GetMapping
    public ResponseEntity<List<Venta>> obtenerTodasLasVentas() {
        List<Venta> ventas = ventaServicio.obtenerTodasLasVentas();
        return ResponseEntity.ok(ventas);
    }

    /**
     * Obtener venta por ID.
     * GET /api/ventas/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Venta> obtenerVentaPorId(@PathVariable Long id) {
        return ventaServicio.obtenerVentaPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Obtener venta por evento.
     * GET /api/ventas/evento/{eventoId}
     */
    @GetMapping("/evento/{eventoId}")
    public ResponseEntity<Venta> obtenerVentaPorEvento(@PathVariable Long eventoId) {
        return ventaServicio.obtenerVentaPorEvento(eventoId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Obtener ventas por producto.
     * GET /api/ventas/producto/{productoId}
     */
    @GetMapping("/producto/{productoId}")
    public ResponseEntity<List<Venta>> obtenerVentasPorProducto(@PathVariable Long productoId) {
        List<Venta> ventas = ventaServicio.obtenerVentasPorProducto(productoId);
        return ResponseEntity.ok(ventas);
    }

    /**
     * Obtener ventas por cliente.
     * GET /api/ventas/cliente/{clienteId}
     */
    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<Venta>> obtenerVentasPorCliente(@PathVariable Long clienteId) {
        List<Venta> ventas = ventaServicio.obtenerVentasPorCliente(clienteId);
        return ResponseEntity.ok(ventas);
    }

    /**
     * Obtener ventas por estado.
     * GET /api/ventas/estado/{estado}
     */
    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<Venta>> obtenerVentasPorEstado(@PathVariable EstadoVenta estado) {
        List<Venta> ventas = ventaServicio.obtenerVentasPorEstado(estado);
        return ResponseEntity.ok(ventas);
    }

    /**
     * Obtener ventas en rango de fechas.
     * GET /api/ventas/periodo?inicio=2024-01-01T00:00:00&fin=2024-12-31T23:59:59
     */
    @GetMapping("/periodo")
    public ResponseEntity<List<Venta>> obtenerVentasEnPeriodo(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin) {
        List<Venta> ventas = ventaServicio.obtenerVentasEnPeriodo(inicio, fin);
        return ResponseEntity.ok(ventas);
    }

    /**
     * Actualizar estado de venta.
     * PATCH /api/ventas/{id}/estado
     */
    @PatchMapping("/{id}/estado")
    public ResponseEntity<Venta> actualizarEstadoVenta(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        try {
            EstadoVenta nuevoEstado = EstadoVenta.valueOf(request.get("estado"));
            Venta ventaActualizada = ventaServicio.actualizarEstadoVenta(id, nuevoEstado);
            return ResponseEntity.ok(ventaActualizada);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Eliminar venta.
     * DELETE /api/ventas/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> eliminarVenta(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            ventaServicio.eliminarVenta(id);
            response.put("success", true);
            response.put("message", "Venta eliminada exitosamente");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    /**
     * Obtener estadísticas de ventas por producto.
     * GET /api/ventas/estadisticas/producto/{productoId}
     */
    @GetMapping("/estadisticas/producto/{productoId}")
    public ResponseEntity<Map<String, Object>> obtenerEstadisticasProducto(@PathVariable Long productoId) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalVendido", ventaServicio.calcularTotalVendidoPorProducto(productoId));
        stats.put("cantidadVendida", ventaServicio.calcularCantidadVendidaPorProducto(productoId));
        stats.put("historialVentas", ventaServicio.obtenerVentasPorProducto(productoId));
        return ResponseEntity.ok(stats);
    }

    /**
     * Obtener estadísticas de ventas en periodo.
     * GET /api/ventas/estadisticas/periodo?inicio=...&fin=...
     */
    @GetMapping("/estadisticas/periodo")
    public ResponseEntity<Map<String, Object>> obtenerEstadisticasPeriodo(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalVendido", ventaServicio.calcularTotalVendidoEnPeriodo(inicio, fin));
        stats.put("ventas", ventaServicio.obtenerVentasEnPeriodo(inicio, fin));
        return ResponseEntity.ok(stats);
    }
}