package com.Oni3D.repositorio;

import com.Oni3D.model.Evento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventoRepositorio extends JpaRepository<Evento, Long> {

    // Buscar eventos pendientes hasta ahora que no hayan sido notificados
    List<Evento> findByNotificadoFalseAndFechaNotificacionLessThanEqual(LocalDateTime fecha);



}
