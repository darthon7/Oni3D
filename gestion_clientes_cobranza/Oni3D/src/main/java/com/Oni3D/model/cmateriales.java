package com.Oni3D.model;

import jakarta.persistence.*;

@Entity
@Table(name = "Materiales")
public class cmateriales {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idMaterial;

    @Column(nullable = false, length = 100)
    private String nombreMaterial;

    @Column(nullable = false, length = 100)
    private String precioMaterial;

    @Column(nullable = false)
    private double cantidadMaterial;

    // Constructor vacío (requerido por JPA)
    public cmateriales() {
    }

    // Constructor con todos los atributos
    public cmateriales(Long idMaterial, String nombreMaterial, String precioMaterial, double cantidadMaterial) {
        this.idMaterial = idMaterial;
        this.nombreMaterial = nombreMaterial;
        this.precioMaterial = precioMaterial;
        this.cantidadMaterial = cantidadMaterial;
    }

    // Constructor sin ID (para crear nuevos empleados)
    public cmateriales(String nombreMaterial, String precioMaterial, double cantidadMaterial) {
        this.nombreMaterial = nombreMaterial;
        this.precioMaterial = precioMaterial;
        this.cantidadMaterial = cantidadMaterial;
    }

    // Getters y Setters
    public Long getIdMaterial() {
        return idMaterial;
    }

    public void setIdMaterial(Long idMaterial ) {
        this.idMaterial = idMaterial;
    }

    public String getNombreMaterial() {
        return nombreMaterial;
    }

    public void setNombreMaterial(String nombreMaterial) {
        this.nombreMaterial = nombreMaterial;
    }

    public String getPrecioMaterial() {
        return precioMaterial;
    }

    public void setPrecioMaterial(String precioMaterial) {
        this.precioMaterial = precioMaterial;
    }

    public double getCantidadMaterial() {
        return cantidadMaterial;
    }

    public void setCantidadMaterial(double cantidadMaterial) {
        this.cantidadMaterial = cantidadMaterial;
    }

    // toString
    @Override
    public String toString() {
        return "Material{" +
                "idMateriales=" + idMaterial +
                ", nombreMaterial='" + nombreMaterial + '\'' +
                ", precioMaterial='" + precioMaterial + '\'' +
                ", cantidadMaterial=" + cantidadMaterial +
                '}';
    }
}
