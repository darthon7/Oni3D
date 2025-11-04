package com.Oni3D.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ventas")
public class Venta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idVenta;

    // Relación con Evento (1 Evento = 1 Venta)
    @OneToOne
    @JoinColumn(name = "evento_id", nullable = false, unique = true)
    private Evento evento;

    // Relación con Producto
    @ManyToOne
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;

    // Relación con Cliente (cEmpleados)
    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private cEmpleados cliente;

    @Column(nullable = false)
    private Integer cantidad;

    @Column(nullable = false)
    private Double precioUnitario; // Precio del producto al momento de la venta

    @Column(nullable = false)
    private Double total; // cantidad * precioUnitario

    @Column(nullable = false)
    private LocalDateTime fechaVenta;

    @Column(length = 1000)
    private String descripcion;

    // Estado de la venta (opcional)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EstadoVenta estado = EstadoVenta.COMPLETADA;

    // --- Constructores ---
    public Venta() {
    }

    public Venta(Evento evento, Producto producto, cEmpleados cliente,
                 Integer cantidad, Double precioUnitario, LocalDateTime fechaVenta) {
        this.evento = evento;
        this.producto = producto;
        this.cliente = cliente;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
        this.total = cantidad * precioUnitario;
        this.fechaVenta = fechaVenta;
    }

    // --- Getters y Setters ---
    public Long getIdVenta() {
        return idVenta;
    }

    public void setIdVenta(Long idVenta) {
        this.idVenta = idVenta;
    }

    public Evento getEvento() {
        return evento;
    }

    public void setEvento(Evento evento) {
        this.evento = evento;
    }

    public Producto getProducto() {
        return producto;
    }

    public void setProducto(Producto producto) {
        this.producto = producto;
    }

    public cEmpleados getCliente() {
        return cliente;
    }

    public void setCliente(cEmpleados cliente) {
        this.cliente = cliente;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
        // Recalcular total si cambia cantidad
        if (this.precioUnitario != null) {
            this.total = cantidad * this.precioUnitario;
        }
    }

    public Double getPrecioUnitario() {
        return precioUnitario;
    }

    public void setPrecioUnitario(Double precioUnitario) {
        this.precioUnitario = precioUnitario;
        // Recalcular total si cambia precio
        if (this.cantidad != null) {
            this.total = this.cantidad * precioUnitario;
        }
    }

    public Double getTotal() {
        return total;
    }

    public void setTotal(Double total) {
        this.total = total;
    }

    public LocalDateTime getFechaVenta() {
        return fechaVenta;
    }

    public void setFechaVenta(LocalDateTime fechaVenta) {
        this.fechaVenta = fechaVenta;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public EstadoVenta getEstado() {
        return estado;
    }

    public void setEstado(EstadoVenta estado) {
        this.estado = estado;
    }

    @Override
    public String toString() {
        return "Venta{" +
                "idVenta=" + idVenta +
                ", productoId=" + (producto != null ? producto.getIdProducto() : null) +
                ", clienteId=" + (cliente != null ? cliente.getIdEmpleado() : null) +
                ", cantidad=" + cantidad +
                ", total=" + total +
                ", fechaVenta=" + fechaVenta +
                ", estado=" + estado +
                '}';
    }
}