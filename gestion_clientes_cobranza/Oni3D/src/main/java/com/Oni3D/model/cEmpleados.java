package com.Oni3D.model;

import jakarta.persistence.*;

@Entity
@Table(name = "empleados")
public class cEmpleados {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idEmpleado;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false, length = 100)
    private String departamento;

    @Column(nullable = false)
    private double sueldo;

    // Constructor vacío (requerido por JPA)
    public cEmpleados() {
    }

    // Constructor con todos los atributos
    public cEmpleados(Long idEmpleado, String nombre, String departamento, double sueldo) {
        this.idEmpleado = idEmpleado;
        this.nombre = nombre;
        this.departamento = departamento;
        this.sueldo = sueldo;
    }

    // Constructor sin ID (para crear nuevos empleados)
    public cEmpleados(String nombre, String departamento, double sueldo) {
        this.nombre = nombre;
        this.departamento = departamento;
        this.sueldo = sueldo;
    }

    // Getters y Setters
    public Long getIdEmpleado() {
        return idEmpleado;
    }

    public void setIdEmpleado(Long idEmpleado) {
        this.idEmpleado = idEmpleado;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDepartamento() {
        return departamento;
    }

    public void setDepartamento(String departamento) {
        this.departamento = departamento;
    }

    public double getSueldo() {
        return sueldo;
    }

    public void setSueldo(double sueldo) {
        this.sueldo = sueldo;
    }

    // toString
    @Override
    public String toString() {
        return "Empleado{" +
                "idEmpleado=" + idEmpleado +
                ", nombre='" + nombre + '\'' +
                ", departamento='" + departamento + '\'' +
                ", sueldo=" + sueldo +
                '}';
    }
}
