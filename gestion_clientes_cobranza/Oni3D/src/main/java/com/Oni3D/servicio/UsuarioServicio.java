package com.Oni3D.servicio;

import com.Oni3D.model.Usuario;
import com.Oni3D.repositorio.UsuarioRepositorio;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class UsuarioServicio {

    private static final Logger log = LoggerFactory.getLogger(UsuarioServicio.class);

    private final UsuarioRepositorio usuarioRepositorio;
    private final PasswordEncoder passwordEncoder; // NUEVO

    @Autowired
    public UsuarioServicio(UsuarioRepositorio usuarioRepositorio,
                           PasswordEncoder passwordEncoder) { // NUEVO PARÁMETRO
        this.usuarioRepositorio = usuarioRepositorio;
        this.passwordEncoder = passwordEncoder; // NUEVO
    }

    // --- REGISTRO CON ENCRIPTACIÓN ---
    @Transactional
    public Usuario registrarUsuario(Usuario usuario) {
        log.info("Registrando usuario: {}", usuario.getUsername());

        if (usuarioRepositorio.existsByUsername(usuario.getUsername())) {
            throw new RuntimeException("El username ya existe: " + usuario.getUsername());
        }
        if (usuarioRepositorio.existsByEmail(usuario.getEmail())) {
            throw new RuntimeException("El email ya existe: " + usuario.getEmail());
        }

        // ENCRIPTAR LA CONTRASEÑA ANTES DE GUARDAR
        String passwordOriginal = usuario.getPassword();
        String passwordEncriptada = passwordEncoder.encode(passwordOriginal);
        usuario.setPassword(passwordEncriptada);

        log.debug("Contraseña encriptada exitosamente");

        return usuarioRepositorio.save(usuario);
    }

    // --- LOGIN CON VALIDACIÓN DE CONTRASEÑA ENCRIPTADA ---
    public Usuario validarCredenciales(String usernameOrEmail, String password) {
        log.info("Validando credenciales para: {}", usernameOrEmail);

        Optional<Usuario> usuarioOpt = usuarioRepositorio.findByUsernameOrEmail(
                usernameOrEmail,
                usernameOrEmail
        );

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();

            // COMPARAR CONTRASEÑA USANDO BCrypt
            boolean passwordCoincide = passwordEncoder.matches(password, usuario.getPassword());

            if (passwordCoincide) {
                log.info("Credenciales válidas para usuario: {}", usuario.getUsername());
                return usuario;
            } else {
                log.warn("Contraseña incorrecta para: {}", usernameOrEmail);
            }
        } else {
            log.warn("Usuario no encontrado: {}", usernameOrEmail);
        }

        return null;
    }

    // --- MÉTODOS DE CONSULTA (sin cambios) ---
    public Optional<Usuario> buscarPorId(Long id) {
        return usuarioRepositorio.findById(id);
    }

    public Optional<Usuario> buscarPorUsername(String username) {
        return usuarioRepositorio.findByUsername(username);
    }

    public Optional<Usuario> buscarPorEmail(String email) {
        return usuarioRepositorio.findByEmail(email);
    }

    public boolean existeUsername(String username) {
        return usuarioRepositorio.existsByUsername(username);
    }

    public boolean existeEmail(String email) {
        return usuarioRepositorio.existsByEmail(email);
    }

    public List<Usuario> obtenerTodosLosUsuarios() {
        return usuarioRepositorio.findAll();
    }

    // --- ACTUALIZAR USUARIO CON ENCRIPTACIÓN ---
    @Transactional
    public Usuario actualizarUsuario(Long id, Usuario detallesUsuario) {
        log.info("Actualizando usuario con ID: {}", id);

        Usuario usuario = usuarioRepositorio.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + id));

        // Validaciones de Unicidad
        Optional<Usuario> checkUsername = usuarioRepositorio.findByUsername(detallesUsuario.getUsername());
        if (checkUsername.isPresent() && !checkUsername.get().getId().equals(id)) {
            throw new RuntimeException("El username '" + detallesUsuario.getUsername() + "' ya está en uso por otro usuario.");
        }

        Optional<Usuario> checkEmail = usuarioRepositorio.findByEmail(detallesUsuario.getEmail());
        if (checkEmail.isPresent() && !checkEmail.get().getId().equals(id)) {
            throw new RuntimeException("El email '" + detallesUsuario.getEmail() + "' ya está en uso por otro usuario.");
        }

        // Actualizar campos básicos
        usuario.setUsername(detallesUsuario.getUsername());
        usuario.setEmail(detallesUsuario.getEmail());
        usuario.setTipoCuenta(detallesUsuario.getTipoCuenta());
        usuario.setProfileImageFilename(detallesUsuario.getProfileImageFilename());

        // ACTUALIZAR CONTRASEÑA SOLO SI SE PROPORCIONA UNA NUEVA
        if (detallesUsuario.getPassword() != null && !detallesUsuario.getPassword().trim().isEmpty()) {
            // IMPORTANTE: Verificar si ya está encriptada (para evitar re-encriptar)
            // Una contraseña BCrypt siempre empieza con $2a$, $2b$ o $2y$
            String nuevaPassword = detallesUsuario.getPassword();

            if (!nuevaPassword.startsWith("$2a$") && !nuevaPassword.startsWith("$2b$") && !nuevaPassword.startsWith("$2y$")) {
                // No está encriptada, encriptarla
                usuario.setPassword(passwordEncoder.encode(nuevaPassword));
                log.debug("Contraseña actualizada y encriptada");
            } else {
                // Ya está encriptada, mantenerla como está
                usuario.setPassword(nuevaPassword);
                log.debug("Contraseña ya encriptada, manteniendo");
            }
        }

        return usuarioRepositorio.save(usuario);
    }

    // --- ELIMINAR USUARIO (sin cambios) ---
    @Transactional
    public void eliminarUsuario(Long id) {
        log.info("Eliminando usuario con ID: {}", id);

        Usuario usuario = usuarioRepositorio.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + id));

        String filenameToDelete = usuario.getProfileImageFilename();

        usuarioRepositorio.deleteById(id);

        log.info("Usuario eliminado exitosamente: {}", usuario.getUsername());

        // Opcional: Eliminar imagen de perfil
        if (filenameToDelete != null && !filenameToDelete.isEmpty()) {
            log.debug("Pendiente: Eliminar archivo de imagen: {}", filenameToDelete);
        }
    }
}