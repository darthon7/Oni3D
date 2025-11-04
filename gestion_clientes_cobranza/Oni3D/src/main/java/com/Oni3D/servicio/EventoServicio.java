package com.Oni3D.servicio;

import com.Oni3D.model.Evento;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface EventoServicio {
    Evento guardar(Evento evento);
    Optional<Evento> obtenerPorId(Long id);
    List<Evento> obtenerPendientesHasta(LocalDateTime fecha);
    Evento marcarNotificado(Long id);
    List<Evento> obtenerTodosLosEventos();

    /**
     * NUEVO: Añadido para eliminar eventos desde el calendario.
     * @param id El ID del evento a eliminar.
     */
    void deleteById(Long id);

    /**
     * NUEVO: Añadido para actualizar eventos desde el calendario.
     * @param id El ID del evento a actualizar.
     * @param evento Los nuevos datos del evento.
     * @return El evento actualizado.
     */
    Evento actualizar(Long id, Evento evento);
}

