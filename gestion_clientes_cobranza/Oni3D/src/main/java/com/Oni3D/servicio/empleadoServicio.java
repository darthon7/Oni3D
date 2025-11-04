package com.Oni3D.servicio;

import com.Oni3D.model.cEmpleados;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * Interfaz de la capa de servicio para la entidad cEmpleado.
 */
public interface empleadoServicio {

    cEmpleados crearEmpleado(cEmpleados empleado);

    cEmpleados actualizarEmpleado(Long idEmpleado, cEmpleados empleadoActualizado);

    cEmpleados obtenerEmpleadoPorId(Long idEmpleado);

    List<cEmpleados> obtenerTodosLosEmpleados();

    void eliminarEmpleado(Long idEmpleado);

    List<cEmpleados> buscarPorNombre(String nombre);

    List<cEmpleados> buscarPorDepartamento(String departamento);

    List<cEmpleados> buscarPorSueldoMayorQue(double sueldo);

    Page<cEmpleados> obtenerEmpleadosPaginados(Pageable pageable);
}
