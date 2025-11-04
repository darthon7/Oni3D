package com.Oni3D.Controller;

import com.Oni3D.model.TipoCuenta; // Importar Enum
import com.Oni3D.model.Usuario;
import com.Oni3D.servicio.UsuarioServicio;
import org.slf4j.Logger; // Importar Logger
import org.slf4j.LoggerFactory; // Importar LoggerFactory
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile; // Ya no es necesario aquí

import java.util.HashMap;
import java.util.Map;
import java.util.Optional; // Importar Optional

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173") // O tu origen específico
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class); // Añadir Logger

    @Autowired
    private UsuarioServicio usuarioServicio;

    // Ya NO necesitamos inyectar FileStorageService aquí
    // @Autowired
    // private FileStorageService fileStorageService;

    /**
     * Endpoint de registro modificado para aceptar FormData con profileImageFilename (String opcional).
     */
    @PostMapping("/registro")
    public ResponseEntity<Map<String, Object>> registrarUsuario(
            @RequestParam("username") String username,
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam("tipoCuenta") String tipoCuentaStr,
            // AHORA esperamos el filename como String, NO el archivo MultipartFile
            @RequestParam(value = "profileImageFilename", required = false) String profileImageFilename
    ) {
        Map<String, Object> response = new HashMap<>();
        log.info("Intentando registrar usuario: {}", username); // Log de inicio

        try {
            // Convertir String a Enum TipoCuenta (igual que antes)
            TipoCuenta tipoCuenta;
            try {
                tipoCuenta = TipoCuenta.valueOf(tipoCuentaStr.toUpperCase());
            } catch (IllegalArgumentException e) {
                log.warn("Tipo de cuenta inválido recibido: {}", tipoCuentaStr);
                response.put("success", false);
                response.put("message", "Tipo de cuenta inválido: " + tipoCuentaStr);
                return ResponseEntity.badRequest().body(response);
            }

            // Crear el objeto Usuario con los datos recibidos
            Usuario usuario = new Usuario();
            usuario.setUsername(username);
            usuario.setEmail(email);
            usuario.setPassword(password); // Recordar: Sin encriptar
            usuario.setTipoCuenta(tipoCuenta);
            // Asignar el filename recibido (puede ser null si no se subió imagen)
            usuario.setProfileImageFilename(profileImageFilename);

            log.debug("Objeto Usuario a registrar: {}", usuario); // Log del objeto

            // Registrar el usuario usando el servicio
            Usuario nuevoUsuario = usuarioServicio.registrarUsuario(usuario);
            log.info("Usuario registrado exitosamente con ID: {}", nuevoUsuario.getId());

            // Preparar respuesta exitosa (incluyendo el filename guardado)
            response.put("success", true);
            response.put("message", "Usuario registrado exitosamente");
            response.put("usuario", Map.of(
                    "id", nuevoUsuario.getId(),
                    "username", nuevoUsuario.getUsername(),
                    "email", nuevoUsuario.getEmail(),
                    "tipoCuenta", nuevoUsuario.getTipoCuenta().name(),
                    // Devolver el filename que SÍ se guardó en la BD
                    "profileImageFilename", nuevoUsuario.getProfileImageFilename()
            ));
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) { // Capturar errores como "username ya existe"
            log.warn("Error de negocio durante el registro: {}", e.getMessage());
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) { // Capturar otros errores inesperados
            log.error("Error inesperado durante el registro: ", e);
            response.put("success", false);
            response.put("message", "Ocurrió un error inesperado durante el registro.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // --- Endpoint para login (Modificado para incluir profileImageFilename) ---
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginData) {
        Map<String, Object> response = new HashMap<>();
        String usernameOrEmail = loginData.get("usernameOrEmail");
        String password = loginData.get("password");
        log.info("Intento de login para: {}", usernameOrEmail);

        Usuario usuario = usuarioServicio.validarCredenciales(usernameOrEmail, password);

        if (usuario != null) {
            log.info("Login exitoso para usuario ID: {}", usuario.getId());
            response.put("success", true);
            response.put("message", "Login exitoso");
            response.put("usuario", Map.of(
                    "id", usuario.getId(),
                    "username", usuario.getUsername(),
                    "email", usuario.getEmail(),
                    "tipoCuenta", usuario.getTipoCuenta().name(),
                    // Incluir filename en la respuesta de login
                    "profileImageFilename", usuario.getProfileImageFilename()
            ));
            return ResponseEntity.ok(response);
        } else {
            log.warn("Credenciales inválidas para: {}", usernameOrEmail);
            response.put("success", false);
            response.put("message", "Credenciales inválidas");
            // Usar 401 Unauthorized para fallos de login es más estándar
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    // --- Endpoints check-username y check-email (sin cambios) ---
    @GetMapping("/check-username/{username}")
    public ResponseEntity<Map<String, Object>> checkUsername(@PathVariable String username) {
        Map<String, Object> response = new HashMap<>();
        boolean existe = usuarioServicio.existeUsername(username);
        response.put("existe", existe);
        // response.put("message", existe ? "Username ya existe" : "Username disponible"); // Mensaje opcional
        return ResponseEntity.ok(response);
    }

    @GetMapping("/check-email/{email}")
    public ResponseEntity<Map<String, Object>> checkEmail(@PathVariable String email) {
        Map<String, Object> response = new HashMap<>();
        boolean existe = usuarioServicio.existeEmail(email);
        response.put("existe", existe);
        // response.put("message", existe ? "Email ya existe" : "Email disponible"); // Mensaje opcional
        return ResponseEntity.ok(response);
    }

    // --- Endpoint obtenerUsuario (Modificado para incluir profileImageFilename) ---
    @GetMapping("/usuario/{id}")
    public ResponseEntity<Map<String, Object>> obtenerUsuario(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        log.info("Buscando usuario por ID: {}", id);

        // Usamos Optional para manejar el caso de no encontrado más limpiamente
        Optional<Usuario> usuarioOpt = usuarioServicio.buscarPorId(id);

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            log.debug("Usuario encontrado: {}", usuario.getUsername());
            response.put("success", true);
            response.put("usuario", Map.of(
                    "id", usuario.getId(),
                    "username", usuario.getUsername(),
                    "email", usuario.getEmail(),
                    "tipoCuenta", usuario.getTipoCuenta().name(),
                    // Incluir filename en la respuesta
                    "profileImageFilename", usuario.getProfileImageFilename()
            ));
            return ResponseEntity.ok(response);
        } else {
            log.warn("Usuario no encontrado con ID: {}", id);
            response.put("success", false);
            response.put("message", "Usuario no encontrado");
            // Devolver 404 Not Found es más apropiado aquí
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
}

