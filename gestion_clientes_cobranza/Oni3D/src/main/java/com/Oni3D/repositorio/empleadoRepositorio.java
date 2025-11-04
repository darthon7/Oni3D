package com.Oni3D.repositorio;

import com.Oni3D.model.Refaccion;
import com.Oni3D.model.cEmpleados;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio JPA para la entidad cEmpleado.
 * Extiende JpaRepository para heredar operaciones CRUD, paging y sorting.
 */
@Repository
public interface empleadoRepositorio extends JpaRepository<cEmpleados, Long> {

    /**
     * Busca empleados por nombre (exact match).
     */
    List<cEmpleados> findByNombre(String nombre);

    /**
     * Busca empleados por departamento (exact match).
     */
    List<cEmpleados> findByDepartamento(String departamento);

    /**
     * Busca empleados con sueldo mayor al indicado.
     */
    List<cEmpleados> findBySueldoGreaterThan(double sueldo);


    List<cEmpleados> findByIdEmpleado(Long idEmpleado);

    /**
     * Busca un empleado por su idEmpleado (envoltura Optional).
     * Nota: JpaRepository ya provee findById(Long id), esto es solo por conveniencia si quieres usar este nombre.
     */
}
