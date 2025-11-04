package com.Oni3D.Controller;

import com.Oni3D.exception.ResourceNotFoundException; // Asegúrate de tener esta importación
import com.Oni3D.model.Evento;
import com.Oni3D.servicio.EventoServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional; // Asegúrate de tener esta importación

@RestController
@RequestMapping("/api/eventos")
@CrossOrigin(origins = "http://localhost:5173") // ajusta el puerto de React si es distinto
public class EventoController {

    @Autowired
    private EventoServicio eventoServicio;

    // Crear / guardar evento
    @PostMapping
    public ResponseEntity<Evento> crearEvento(@RequestBody Evento evento) {
        Evento guardado = eventoServicio.guardar(evento);
        return ResponseEntity.ok(guardado);
    }


    // Obtener todos los eventos (para el calendario)
    @GetMapping
    public ResponseEntity<List<Evento>> listarTodos() {
        // Llama al nuevo método que trae TODOS los eventos
        return ResponseEntity.ok(eventoServicio.obtenerTodosLosEventos());
    }


    // --- NUEVO ENDPOINT AÑADIDO ---
    /**
     * Obtener un evento por su ID.
     * Necesario para la página "Editar Alerta".
     */
    @GetMapping("/{id}")
    public ResponseEntity<Evento> getEventoById(@PathVariable Long id) {
        // Busca el evento usando el servicio
        Evento evento = eventoServicio.obtenerPorId(id)
                // Si no lo encuentra, lanza la excepción
                .orElseThrow(() -> new ResourceNotFoundException("Evento", "id", id));
        // Si lo encuentra, devuelve 200 OK con el evento
        return ResponseEntity.ok(evento);
    }
    // --- FIN DEL NUEVO ENDPOINT ---


    // Endpoint clave: obtener eventos pendientes hasta ahora
    @GetMapping("/pending")
    public ResponseEntity<List<Evento>> obtenerPendientes() {
        LocalDateTime ahora = LocalDateTime.now();
        List<Evento> pendientes = eventoServicio.obtenerPendientesHasta(ahora);
        return ResponseEntity.ok(pendientes);
    }

    // Marcar como notificado
    @PostMapping("/{id}/mark-notified")
    public ResponseEntity<Evento> marcarNotificado(@PathVariable Long id) {
        Evento actualizado = eventoServicio.marcarNotificado(id);
        return ResponseEntity.ok(actualizado);
    }

    // Actualizar un evento (PUT)
    @PutMapping("/{id}")
    public ResponseEntity<Evento> actualizarEvento(@PathVariable Long id, @RequestBody Evento eventoDetalles) {
        Evento actualizado = eventoServicio.actualizar(id, eventoDetalles);
        return ResponseEntity.ok(actualizado);
    }

    // Eliminar un evento (DELETE)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvento(@PathVariable Long id) {
        eventoServicio.deleteById(id);
        return ResponseEntity.noContent().build(); // 204 No Content es estándar para DELETE exitoso
    }
}

