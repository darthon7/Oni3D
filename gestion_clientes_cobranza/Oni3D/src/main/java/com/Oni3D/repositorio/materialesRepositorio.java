package com.Oni3D.repositorio;

import com.Oni3D.model.cmateriales;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio JPA para la entidad cEmpleado.
 * Extiende JpaRepository para heredar operaciones CRUD, paging y sorting.
 */
@Repository
public interface materialesRepositorio extends JpaRepository<cmateriales, Long> {

    /**
     * Busca empleados por nombre (exact match).
     */
    List<cmateriales> findBynombreMaterial(String nombreMaterial);

    /**
     * Busca empleados por departamento (exact match).
     */
    List<cmateriales> findByprecioMaterial(String precioMaterial);

    /**
     * Busca empleados con sueldo mayor al indicado.
     */
    List<cmateriales> findBycantidadMaterial(double cantidadMaterial);

    /**
     * Busca un empleado por su idEmpleado (envoltura Optional).
     * Nota: JpaRepository ya provee findById(Long id), esto es solo por conveniencia si quieres usar este nombre.
     */
    Optional<cmateriales> findByidMaterial(Long idMaterial);
}
