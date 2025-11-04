package com.Oni3D.Controller;

import com.Oni3D.model.Impresora;
import com.Oni3D.servicio.ImpresoraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/impresoras")
@CrossOrigin(origins = "http://localhost:5173") // ¡Ajusta este puerto al de tu React!
public class ImpresoraController {

    @Autowired
    private ImpresoraService impresoraService;

    // GET (Obtener todas)
    @GetMapping
    public List<Impresora> getAllImpresoras() {
        return impresoraService.getAllImpresoras();
    }

    // GET (Obtener por ID)
    @GetMapping("/{id}")
    public ResponseEntity<Impresora> getImpresoraById(@PathVariable Long id) {
        return impresoraService.getImpresoraById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST (Crear nueva)
    @PostMapping
    public Impresora createImpresora(@RequestBody Impresora impresora) {
        return impresoraService.saveImpresora(impresora);
    }

    // PUT (Actualizar)
    @PutMapping("/{id}")
    public ResponseEntity<Impresora> updateImpresora(@PathVariable Long id, @RequestBody Impresora detalles) {
        try {
            Impresora actualizada = impresoraService.updateImpresora(id, detalles);
            return ResponseEntity.ok(actualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE (Borrar)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteImpresora(@PathVariable Long id) {
        try {
            impresoraService.deleteImpresora(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}