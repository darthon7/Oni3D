package com.Oni3D.servicio;

import com.Oni3D.exception.ResourceNotFoundException;
import com.Oni3D.model.*;
import com.Oni3D.repositorio.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class VentaServicioImpl implements VentaServicio {

    @Autowired
    private VentaRepositorio ventaRepositorio;

    @Autowired
    private EventoRepositorio eventoRepositorio;

    @Autowired
    private ProductoRepositorio productoRepositorio;

    @Autowired
    private empleadoRepositorio empleadoRepositorio;

    @Override
    public Venta registrarVentaDesdeEvento(Long eventoId) {
        // 1. Verificar si ya existe una venta para este evento
        Optional<Venta> ventaExistente = ventaRepositorio.findByEventoId(eventoId);
        if (ventaExistente.isPresent()) {
            throw new RuntimeException("Ya existe una venta registrada para este evento (ID: " + eventoId + ")");
        }

        // 2. Obtener el evento
        Evento evento = eventoRepositorio.findById(eventoId)
                .orElseThrow(() -> new ResourceNotFoundException("Evento", "id", eventoId));

        // 3. Validar que el evento tenga los datos necesarios
        if (evento.getProductoId() == null) {
            throw new RuntimeException("El evento no tiene un producto asociado");
        }
        if (evento.getUsuarioId() == null) {
            throw new RuntimeException("El evento no tiene un cliente asociado");
        }
        if (evento.getCantidad() == null || evento.getCantidad() <= 0) {
            throw new RuntimeException("El evento no tiene una cantidad válida");
        }

        // 4. Obtener producto y cliente
        Producto producto = productoRepositorio.findById(evento.getProductoId())
                .orElseThrow(() -> new ResourceNotFoundException("Producto", "id", evento.getProductoId()));

        cEmpleados cliente = empleadoRepositorio.findById(evento.getUsuarioId())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente", "id", evento.getUsuarioId()));

        // 5. Crear la venta
        Venta venta = new Venta();
        venta.setEvento(evento);
        venta.setProducto(producto);
        venta.setCliente(cliente);
        venta.setCantidad(evento.getCantidad());
        venta.setPrecioUnitario(producto.getPrecio()); // Precio al momento de la venta
        venta.setTotal(evento.getCantidad() * producto.getPrecio());
        venta.setFechaVenta(evento.getFechaNotificacion() != null
                ? evento.getFechaNotificacion()
                : LocalDateTime.now());
        venta.setDescripcion(evento.getDescripcion());
        venta.setEstado(EstadoVenta.COMPLETADA);

        // 6. Guardar venta
        return ventaRepositorio.save(venta);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Venta> obtenerVentaPorId(Long id) {
        return ventaRepositorio.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Venta> obtenerVentaPorEvento(Long eventoId) {
        return ventaRepositorio.findByEventoId(eventoId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Venta> obtenerTodasLasVentas() {
        return ventaRepositorio.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Venta> obtenerVentasPorProducto(Long productoId) {
        return ventaRepositorio.findByProductoIdProducto(productoId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Venta> obtenerVentasPorCliente(Long clienteId) {
        return ventaRepositorio.findByClienteIdEmpleado(clienteId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Venta> obtenerVentasPorEstado(EstadoVenta estado) {
        return ventaRepositorio.findByEstado(estado);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Venta> obtenerVentasEnPeriodo(LocalDateTime inicio, LocalDateTime fin) {
        return ventaRepositorio.findByFechaVentaBetween(inicio, fin);
    }

    @Override
    public Venta actualizarEstadoVenta(Long ventaId, EstadoVenta nuevoEstado) {
        Venta venta = ventaRepositorio.findById(ventaId)
                .orElseThrow(() -> new ResourceNotFoundException("Venta", "id", ventaId));

        venta.setEstado(nuevoEstado);
        return ventaRepositorio.save(venta);
    }

    @Override
    public void eliminarVenta(Long ventaId) {
        if (!ventaRepositorio.existsById(ventaId)) {
            throw new ResourceNotFoundException("Venta", "id", ventaId);
        }
        ventaRepositorio.deleteById(ventaId);
    }

    @Override
    @Transactional(readOnly = true)
    public Double calcularTotalVendidoPorProducto(Long productoId) {
        Double total = ventaRepositorio.calcularTotalVendidoPorProducto(productoId);
        return total != null ? total : 0.0;
    }

    @Override
    @Transactional(readOnly = true)
    public Double calcularTotalVendidoEnPeriodo(LocalDateTime inicio, LocalDateTime fin) {
        Double total = ventaRepositorio.calcularTotalVendidoEnPeriodo(inicio, fin);
        return total != null ? total : 0.0;
    }

    @Override
    @Transactional(readOnly = true)
    public Integer calcularCantidadVendidaPorProducto(Long productoId) {
        Integer cantidad = ventaRepositorio.calcularCantidadVendidaPorProducto(productoId);
        return cantidad != null ? cantidad : 0;
    }
    @Override
    public void eliminarVentaPorEventoId(Long eventoId) {
        Optional<Venta> ventaOpt = ventaRepositorio.findByEventoId(eventoId);
        if (ventaOpt.isPresent()) {
            ventaRepositorio.delete(ventaOpt.get());
            System.out.println("✅ Venta eliminada para evento ID: " + eventoId);
        } else {
            System.out.println("⚠️ No se encontró venta para evento ID: " + eventoId);
        }
    }
}