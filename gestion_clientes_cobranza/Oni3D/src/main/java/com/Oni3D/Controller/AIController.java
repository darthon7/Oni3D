package com.Oni3D.Controller;

import com.Oni3D.servicio.OllamaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:5173")
public class AIController {

    @Autowired
    private OllamaService ollamaService;

    /**
     * Chat GENERAL - Conversación libre sin restricciones (NUEVO)
     */
    @PostMapping("/chat/general")
    public ResponseEntity<Map<String, String>> chatGeneral(@RequestBody Map<String, String> request) {
        String mensaje = request.get("mensaje");
        String respuesta = ollamaService.chat(mensaje);

        return ResponseEntity.ok(Map.of(
                "mensaje", mensaje,
                "respuesta", respuesta,
                "tipo", "general"
        ));
    }

    /**
     * Chat con contexto de base de datos (solo lectura)
     */
    @PostMapping("/chat/database")
    public ResponseEntity<Map<String, String>> chatConBaseDeDatos(@RequestBody Map<String, String> request) {
        String pregunta = request.get("mensaje");
        String respuesta = ollamaService.chatConBaseDeDatos(pregunta);

        return ResponseEntity.ok(Map.of(
                "pregunta", pregunta,
                "respuesta", respuesta,
                "tipo", "database"
        ));
    }

    /**
     * Chat con capacidades CRUD COMPLETAS
     */
    @PostMapping("/chat/actions")
    public ResponseEntity<Map<String, Object>> chatConAcciones(@RequestBody Map<String, String> request) {
        String mensaje = request.get("mensaje");
        System.out.println("DEBUG - Recibido en /chat/actions: " + mensaje);

        Map<String, Object> resultado = ollamaService.chatConAccionesCRUD(mensaje);

        System.out.println("DEBUG - Resultado: " + resultado);

        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "AI Service is running"));
    }
}