package com.Oni3D.repositorio;

import com.Oni3D.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UsuarioRepositorio extends JpaRepository<Usuario, Long> {

    // Buscar usuario por username
    Optional<Usuario> findByUsername(String username);

    // Buscar usuario por email
    Optional<Usuario> findByEmail(String email);

    // Verificar si existe un username
    boolean existsByUsername(String username);

    // Verificar si existe un email
    boolean existsByEmail(String email);

    // Buscar por username o email (útil para login)
    Optional<Usuario> findByUsernameOrEmail(String username, String email);
}