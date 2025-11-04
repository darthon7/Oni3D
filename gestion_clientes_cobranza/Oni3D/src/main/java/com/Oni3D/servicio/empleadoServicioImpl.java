package com.Oni3D.servicio;

import com.Oni3D.model.cEmpleados;
import com.Oni3D.repositorio.empleadoRepositorio;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Implementación de la capa de servicio para cEmpleado.
 */
@Service
@Transactional
public class empleadoServicioImpl implements empleadoServicio {

    private final empleadoRepositorio empleadoRepository;

    public empleadoServicioImpl(empleadoRepositorio empleadoRepository) {
        this.empleadoRepository = empleadoRepository;
    }

    @Override
    public cEmpleados crearEmpleado(cEmpleados empleado) {
        // Si quieres validar campos antes de guardar, hazlo aquí
        return empleadoRepository.save(empleado);
    }

    @Override
    public cEmpleados actualizarEmpleado(Long idEmpleado, cEmpleados empleadoActualizado) {
        cEmpleados empleadoExistente = empleadoRepository.findById(idEmpleado)
                .orElseThrow(() -> new ResourceNotFoundException("Empleado no encontrado con id: " + idEmpleado));

        // Actualizar campos (evita cambiar id)
        empleadoExistente.setNombre(empleadoActualizado.getNombre());
        empleadoExistente.setDepartamento(empleadoActualizado.getDepartamento());
        empleadoExistente.setSueldo(empleadoActualizado.getSueldo());

        return empleadoRepository.save(empleadoExistente);
    }

    @Override
    @Transactional(readOnly = true)
    public cEmpleados obtenerEmpleadoPorId(Long idEmpleado) {
        return empleadoRepository.findById(idEmpleado)
                .orElseThrow(() -> new ResourceNotFoundException("Empleado no encontrado con id: " + idEmpleado));
    }

    @Override
    @Transactional(readOnly = true)
    public List<cEmpleados> obtenerTodosLosEmpleados()
    {
        return empleadoRepository.findAll();
    }

    @Override
    public void eliminarEmpleado(Long idEmpleado) {
        cEmpleados empleadoExistente = empleadoRepository.findById(idEmpleado)
                .orElseThrow(() -> new ResourceNotFoundException("Empleado no encontrado con id: " + idEmpleado));
        empleadoRepository.delete(empleadoExistente);
    }

    @Override
    @Transactional(readOnly = true)
    public List<cEmpleados> buscarPorNombre(String nombre)
    {
        return empleadoRepository.findByNombre(nombre);
    }

    @Override
    @Transactional(readOnly = true)
    public List<cEmpleados> buscarPorDepartamento(String departamento) {
        return empleadoRepository.findByDepartamento(departamento);
    }

    @Override
    @Transactional(readOnly = true)
    public List<cEmpleados> buscarPorSueldoMayorQue(double sueldo) {
        return empleadoRepository.findBySueldoGreaterThan(sueldo);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<cEmpleados> obtenerEmpleadosPaginados(Pageable pageable) {
        return empleadoRepository.findAll(pageable);
    }
}
