package com.Oni3D.servicio;

import com.Oni3D.exception.ResourceNotFoundException; // Asegúrate de importar tu excepción
import com.Oni3D.model.Evento;
import com.Oni3D.repositorio.EventoRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // <--- AÑADIDO


import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true) // transacciones de solo lectura por defecto
public class EventoServicioImpl implements EventoServicio {

    @Autowired
    private EventoRepositorio eventoRepositorio;

    // Añadir al inicio de la clase
    @Autowired
    private VentaServicio ventaServicio;

    // Modificar el método guardar
    @Override
    @Transactional
    public Evento guardar(Evento evento) {
        // Guardar el evento primero
        Evento eventoGuardado = eventoRepositorio.save(evento);

        // Registrar la venta automáticamente
        try {
            ventaServicio.registrarVentaDesdeEvento(eventoGuardado.getId());
        } catch (Exception e) {
            // Log del error pero no falla la creación del evento
            System.err.println("Error al registrar venta automáticamente: " + e.getMessage());
        }

        return eventoGuardado;
    }

    @Override
    public Optional<Evento> obtenerPorId(Long id) {
        return eventoRepositorio.findById(id);
    }

    @Override
    public List<Evento> obtenerPendientesHasta(LocalDateTime fecha) {
        // Asumiendo que tu repositorio tiene este método
        return eventoRepositorio.findByNotificadoFalseAndFechaNotificacionLessThanEqual(fecha);
    }

    @Override
    @Transactional // <--- AÑADIDO: Es una operación de escritura
    public Evento marcarNotificado(Long id) {
        Optional<Evento> opt = eventoRepositorio.findById(id);
        if (opt.isPresent()) {
            Evento e = opt.get();
            e.setNotificado(true);
            return eventoRepositorio.save(e);
        }
        // Lanzar una excepción más específica si la tienes
        throw new ResourceNotFoundException("Evento", "id", id);
    }

    /**
     * Implementación del nuevo método para el calendario
     */
    @Override
    public List<Evento> obtenerTodosLosEventos() {
        return eventoRepositorio.findAll();
    }

    /**
     * Implementación del método para eliminar eventos.
     * @param id El ID del evento a eliminar.
     */
    /**
     * Implementación del método para eliminar eventos.
     * @param id El ID del evento a eliminar.
     */
    @Override
    @Transactional // Es una operación de escritura
    public void deleteById(Long id) {
        // 1. Verificar si existe el evento
        if (!eventoRepositorio.existsById(id)) {
            throw new ResourceNotFoundException("Evento", "id", id);
        }

        // ⭐ 2. PRIMERO eliminar la venta asociada (si existe)
        try {
            ventaServicio.eliminarVentaPorEventoId(id);
            System.out.println("✅ Venta eliminada para evento ID: " + id);
        } catch (Exception e) {
            System.err.println("⚠️ Error al eliminar venta del evento " + id + ": " + e.getMessage());
            // Continuar con la eliminación del evento aunque falle la venta
        }

        // ⭐ 3. LUEGO eliminar el evento
        eventoRepositorio.deleteById(id);
        System.out.println("✅ Evento eliminado ID: " + id);
    }

    /**
     * NUEVO: Implementación del método para actualizar eventos.
     * @param id El ID del evento a actualizar.
     * @param eventoDetalles Los nuevos datos del evento.
     * @return El evento actualizado.
     */
    @Override
    @Transactional // <--- AÑADIDO: Es una operación de escritura
    public Evento actualizar(Long id, Evento eventoDetalles) {
        // 1. Encontrar el evento existente o lanzar excepción
        Evento existente = eventoRepositorio.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Evento", "id", id));

        // 2. Actualizar todos los campos relevantes desde el objeto 'eventoDetalles'
        // (Asumiendo que el frontend enviará los campos que se pueden editar)
        existente.setTitulo(eventoDetalles.getTitulo());
        existente.setDescripcion(eventoDetalles.getDescripcion());
        existente.setFechaNotificacion(eventoDetalles.getFechaNotificacion());
        existente.setUsuarioId(eventoDetalles.getUsuarioId());
        existente.setProductoId(eventoDetalles.getProductoId());
        existente.setCantidad(eventoDetalles.getCantidad());
        // Opcional: decidir si la edición debe resetear la notificación
        // existente.setNotificado(false);

        // 3. Guardar y devolver el evento actualizado
        return eventoRepositorio.save(existente);
    }
}

