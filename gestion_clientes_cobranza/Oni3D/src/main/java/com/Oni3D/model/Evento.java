package com.Oni3D.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "eventos")
public class Evento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;

    @Column(length = 2000)
    private String descripcion;

    // Fecha en que quieres notificar (guardar en UTC o controlar zona)
    private LocalDateTime fechaNotificacion;

    // Evita re-notificaciones
    private boolean notificado = false;

    // Si quieres relacionarlo con un usuario
    private Long usuarioId;

    // --- CAMPOS AÑADIDOS ---
    /**
     * El ID del producto relacionado con esta alerta.
     */
    private Long productoId;

    /**
     * La cantidad de producto en esta alerta.
     */
    private Integer cantidad;

    public Evento() {}

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public LocalDateTime getFechaNotificacion() { return fechaNotificacion; }
    public void setFechaNotificacion(LocalDateTime fechaNotificacion) { this.fechaNotificacion = fechaNotificacion; }

    public boolean isNotificado() { return notificado; }
    public void setNotificado(boolean notificado) { this.notificado = notificado; }

    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }

    // --- NUEVOS GETTERS Y SETTERS ---
    public Long getProductoId() {
        return productoId;
    }

    public void setProductoId(Long productoId) {
        this.productoId = productoId;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }


}
