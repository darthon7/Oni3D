package com.Oni3D.model;

import jakarta.persistence.*;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 50) // Añadida longitud para evitar errores en algunas BD
    private String username;

    @Column(unique = true, nullable = false, length = 100) // Añadida longitud
    private String email;

    @Column(nullable = false, length = 255) // Añadida longitud (especialmente si usaras hash)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_cuenta", nullable = false, length = 20) // Añadida longitud
    private TipoCuenta tipoCuenta;

    // --- NUEVO CAMPO PARA IMAGEN DE PERFIL ---
    @Column(name = "profile_image_filename", length = 255, nullable = true) // Nombre columna, longitud, puede ser nulo
    private String profileImageFilename;


    // Constructor vacío
    public Usuario() {
    }

    // Constructor con parámetros ACTUALIZADO para incluir profileImageFilename
    public Usuario(String username, String email, String password, TipoCuenta tipoCuenta, String profileImageFilename) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.tipoCuenta = tipoCuenta;
        this.profileImageFilename = profileImageFilename; // Añadido
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public TipoCuenta getTipoCuenta() {
        return tipoCuenta;
    }

    public void setTipoCuenta(TipoCuenta tipoCuenta) {
        this.tipoCuenta = tipoCuenta;
    }

    // --- NUEVOS GETTER Y SETTER para profileImageFilename ---
    public String getProfileImageFilename() {
        return profileImageFilename;
    }

    public void setProfileImageFilename(String profileImageFilename) {
        this.profileImageFilename = profileImageFilename;
    }

    // toString ACTUALIZADO
    @Override
    public String toString() {
        return "Usuario{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", tipoCuenta=" + tipoCuenta +
                ", profileImageFilename='" + profileImageFilename + '\'' + // Añadido
                '}';
    }
}
