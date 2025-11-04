package com.Oni3D.Controller;

import com.Oni3D.model.Usuario;
import com.Oni3D.servicio.UsuarioServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/admin") // Nueva ruta base para endpoints de admin
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    @Autowired
    private UsuarioServicio usuarioServicio;

    // --- Endpoint para OBTENER TODOS los usuarios ---
    @GetMapping("/usuarios")
    public ResponseEntity<List<Usuario>> obtenerTodosLosUsuarios() {
        List<Usuario> usuarios = usuarioServicio.obtenerTodosLosUsuarios();
        return ResponseEntity.ok(usuarios);
    }

    // --- Endpoint para ACTUALIZAR un usuario ---
    @PutMapping("/usuarios/{id}")
    public ResponseEntity<?> actualizarUsuario(@PathVariable Long id, @RequestBody Usuario detallesUsuario) {
        Map<String, Object> response = new HashMap<>();
        try {
            Usuario usuarioActualizado = usuarioServicio.actualizarUsuario(id, detallesUsuario);
            response.put("success", true);
            response.put("message", "Usuario actualizado exitosamente");
            response.put("usuario", usuarioActualizado);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // --- Endpoint para ELIMINAR un usuario ---
    @DeleteMapping("/usuarios/{id}")
    public ResponseEntity<Map<String, Object>> eliminarUsuario(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            usuarioServicio.eliminarUsuario(id);
            response.put("success", true);
            response.put("message", "Usuario eliminado exitosamente");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
}
