package com.Oni3D.model;

import jakarta.persistence.*;

/**
 * Entidad que representa un artículo en el stock de pinturas.
 */
@Entity
@Table(name = "stock_pinturas")
public class Pintura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // CAMBIO 1: El ID no puede ser 'Object'.
    // Debe ser 'Long' para que @GeneratedValue(strategy = GenerationType.IDENTITY) funcione.
    private Long id;

    @Column(nullable = false, length = 100)
    private String marca;

    @Column(nullable = false, length = 100)
    private String color;

    // Usamos @Lob para permitir descripciones más largas que un String estándar (255)
    @Lob
    @Column(columnDefinition = "TEXT")
    private String descripcion;

    // Constructor vacío (requerido por JPA)
    public Pintura() {
    }

    // Constructor con parámetros
    public Pintura(String marca, String color, String descripcion) {
        this.marca = marca;
        this.color = color;
        this.descripcion = descripcion;
    }

    // --- Getters y Setters ---

    // CAMBIO 2: El getter ahora devuelve Long, para coincidir con el tipo del campo 'id'.
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    @Override
    public String toString() {
        return "Pintura{" +
                "id=" + id +
                ", marca='" + marca + '\'' +
                ", color='" + color + '\'' +
                '}';
    }

    // CAMBIO 3: Eliminados los métodos duplicados 'getIdPintura' y 'setIdPintura'.
    // Tener getters/setters duplicados para el mismo campo 'id' rompe
    // las convenciones de JavaBean y confunde a JPA.
}
