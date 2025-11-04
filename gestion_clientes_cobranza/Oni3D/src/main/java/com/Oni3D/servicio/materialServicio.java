package com.Oni3D.servicio;

import com.Oni3D.model.cmateriales;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * Interfaz de la capa de servicio para la entidad cEmpleado.
 */
public interface materialServicio {

    cmateriales crearMaterial(cmateriales material);

    cmateriales actualizarMaterial(Long idMaterial, cmateriales materialActualizado);

    cmateriales obtenerMaterialPorId(Long idMaterial);

    List<cmateriales> obtenerTodosLosMateriales();

    void eliminarMaterial(Long idMaterial);

    List<cmateriales> buscarPorNombreMaterial(String nombreMaterial);

    List<cmateriales> buscarPorprecioMaterial(String precioMaterial);

    List<cmateriales> buscarPorCantidadMaterial(double cantidadMaterial);

    Page<cmateriales> obtenerMaterialesPaginados(Pageable pageable);
}
