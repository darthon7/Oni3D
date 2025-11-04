package com.Oni3D.model;
import jakarta.persistence.*;

@Entity
@Table(name = "productos")
public class Producto {

    // ====== Atributos ======
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_producto")
    private Long idProducto;

    @Column(nullable = false)
    private Double precio;

    @Column(nullable = false)
    private Integer stock;

    @Column(length = 255)
    private String descripcion;

    // --- NUEVO CAMPO ---
    @Column(name = "image_filename", length = 255, nullable = true) // Permite nulos, ajusta longitud si es necesario
    private String imageFilename;

    // ====== Constructores ======
    public Producto() {
        // Constructor vacío requerido por JPA
    }

    // Constructor sin ID ni imagen
    public Producto(Double precio, Integer stock, String descripcion) {
        this.precio = precio;
        this.stock = stock;
        this.descripcion = descripcion;
    }

    // Constructor completo (incluyendo imageFilename)
    public Producto(Long idProducto, Double precio, Integer stock, String descripcion, String imageFilename) {
        this.idProducto = idProducto;
        this.precio = precio;
        this.stock = stock;
        this.descripcion = descripcion;
        this.imageFilename = imageFilename;
    }


    // ====== Getters y Setters ======
    public Long getIdProducto() {
        return idProducto;
    }

    public void setIdProducto(Long idProducto) {
        this.idProducto = idProducto;
    }

    public Double getPrecio() {
        return precio;
    }

    public void setPrecio(Double precio) {
        this.precio = precio;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    // --- NUEVOS Getters y Setters para imageFilename ---
    public String getImageFilename() {
        return imageFilename;
    }

    public void setImageFilename(String imageFilename) {
        this.imageFilename = imageFilename;
    }
    // --- Fin Getters y Setters para imageFilename ---


    // ====== toString (Actualizado) ======
    @Override
    public String toString() {
        return "Producto{" +
                "idProducto=" + idProducto +
                ", precio=" + precio +
                ", stock=" + stock +
                ", descripcion='" + descripcion + '\'' +
                ", imageFilename='" + imageFilename + '\'' + // Añadido
                '}';
    }
}

