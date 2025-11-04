package com.Oni3D.Controller;

import com.Oni3D.model.Pintura;
import com.Oni3D.servicio.PinturaServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pinturas")
@CrossOrigin(origins = "http://localhost:5173") // Permitir peticiones desde React
public class PinturaController {

    @Autowired
    private PinturaServicio pinturaServicio;

    // 1. CREAR una nueva pintura
    @PostMapping
    public ResponseEntity<Pintura> guardarPintura(@RequestBody Pintura pintura) {
        Pintura nuevaPintura = pinturaServicio.guardarPintura(pintura);
        return new ResponseEntity<>(nuevaPintura, HttpStatus.CREATED);
    }

    // 2. OBTENER todas las pinturas
    @GetMapping
    public ResponseEntity<List<Pintura>> obtenerTodasLasPinturas() {
        List<Pintura> pinturas = pinturaServicio.obtenerTodasLasPinturas();
        return ResponseEntity.ok(pinturas);
    }

    // 3. OBTENER una pintura por ID
    @GetMapping("/{id}")
    public ResponseEntity<Pintura> obtenerPinturaPorId(@PathVariable Long id) {
        return pinturaServicio.obtenerPinturaPorId(id)
                .map(ResponseEntity::ok) // Si se encuentra, devuelve 200 OK con la pintura
                .orElse(ResponseEntity.notFound().build()); // Si no, devuelve 404 Not Found
    }

    // 4. ACTUALIZAR una pintura
    @PutMapping("/{id}")
    public ResponseEntity<Pintura> actualizarPintura(@PathVariable Long id, @RequestBody Pintura detallesPintura) {
        Pintura pinturaActualizada = pinturaServicio.actualizarPintura(id, detallesPintura);
        return ResponseEntity.ok(pinturaActualizada);
    }

    // 5. ELIMINAR una pintura
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Boolean>> eliminarPintura(@PathVariable Long id) {
        pinturaServicio.eliminarPintura(id);
        // Devolver una respuesta simple de éxito
        Map<String, Boolean> response = new HashMap<>();
        response.put("eliminado", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }

    // 6. BUSCAR pinturas por criterios (marca y/o color)
    @GetMapping("/buscar")
    public ResponseEntity<List<Pintura>> buscarPinturas(
            @RequestParam(required = false) String marca,
            @RequestParam(required = false) String color
    ) {
        List<Pintura> pinturas;
        if (marca != null && color != null) {
            pinturas = pinturaServicio.buscarPorMarcaYColor(marca, color);
        } else if (marca != null) {
            pinturas = pinturaServicio.buscarPorMarca(marca);
        } else if (color != null) {
            pinturas = pinturaServicio.buscarPorColor(color);
        } else {
            // Si no hay parámetros de búsqueda, devolver todo
            pinturas = pinturaServicio.obtenerTodasLasPinturas();
        }
        return ResponseEntity.ok(pinturas);
    }

    // Manejador de excepciones para "No Encontrado"
    // Esto captura la RuntimeException que lanzamos en el servicio
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException ex) {
        // Si el mensaje contiene "no encontrada", devolvemos 404
        if (ex.getMessage().contains("no encontrada")) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
        }
        // Para otros errores de runtime, devolvemos 500
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
