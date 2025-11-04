package com.Oni3D.servicio;

import com.Oni3D.exception.ResourceNotFoundException;
import com.Oni3D.model.cmateriales;
import com.Oni3D.repositorio.materialesRepositorio;
import com.Oni3D.servicio.materialServicio;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementación de la capa de servicio para cmateriales.
 */
@Service
@Transactional
public class materialServicioImpl implements materialServicio {

    private final materialesRepositorio materialRepositorio;

    public materialServicioImpl(materialesRepositorio materialRepositorio) {
        this.materialRepositorio = materialRepositorio;
    }

    @Override
    public cmateriales crearMaterial(cmateriales material) {
        // Puedes agregar validaciones antes de guardar (null checks, reglas de negocio)
        return materialRepositorio.save(material);
    }

    @Override
    public cmateriales actualizarMaterial(Long idMaterial, cmateriales materialActualizado) {
        cmateriales existente = materialRepositorio.findById(idMaterial)
                .orElseThrow(() -> new ResourceNotFoundException("Material no encontrado con id: " + idMaterial));

        // Actualiza los campos relevantes. Ajusta los nombres de getters/setters según tu entidad.
        existente.setNombreMaterial(materialActualizado.getNombreMaterial());
        existente.setPrecioMaterial(materialActualizado.getPrecioMaterial());
        existente.setCantidadMaterial(materialActualizado.getCantidadMaterial());
        // Agrega más campos si tu entidad los tiene

        return materialRepositorio.save(existente);
    }

    @Override
    @Transactional(readOnly = true)
    public cmateriales obtenerMaterialPorId(Long idMaterial) {
        return materialRepositorio.findById(idMaterial)
                .orElseThrow(() -> new ResourceNotFoundException("Material no encontrado con id: " + idMaterial));
    }

    @Override
    @Transactional(readOnly = true)
    public List<cmateriales> obtenerTodosLosMateriales() {
        return materialRepositorio.findAll();
    }

    @Override
    public void eliminarMaterial(Long idMaterial) {
        cmateriales existente = materialRepositorio.findById(idMaterial)
                .orElseThrow(() -> new ResourceNotFoundException("Material no encontrado con id: " + idMaterial));
        materialRepositorio.delete(existente);
    }

    @Override
    @Transactional(readOnly = true)
    public List<cmateriales> buscarPorNombreMaterial(String nombreMaterial) {
        // Implementación defensiva: filtrado en memoria para no depender de métodos custom en el repositorio.
        if (nombreMaterial == null || nombreMaterial.isBlank()) {
            return List.of();
        }
        return materialRepositorio.findAll().stream()
                .filter(m -> m.getNombreMaterial() != null
                        && m.getNombreMaterial().toLowerCase().contains(nombreMaterial.toLowerCase()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<cmateriales> buscarPorprecioMaterial(String precioMaterial) {
        // Como el parámetro viene como String, comparamos con toString del precio en la entidad
        if (precioMaterial == null || precioMaterial.isBlank()) {
            return List.of();
        }
        return materialRepositorio.findAll().stream()
                .filter(m -> {
                    Object precioObj = m.getPrecioMaterial();
                    // Evitamos NP y comparamos por string
                    return precioObj != null && String.valueOf(precioObj).equalsIgnoreCase(precioMaterial);
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<cmateriales> buscarPorCantidadMaterial(double cantidadMaterial) {
        // Buscamos materiales cuya cantidad sea mayor o igual a la solicitada
        return materialRepositorio.findAll().stream()
                .filter(m -> {
                    try {
                        // Asumimos que getCantidadMaterial() devuelve un número (Double/Integer/Number)
                        Number n = (Number) m.getCantidadMaterial();
                        return n != null && n.doubleValue() >= cantidadMaterial;
                    } catch (ClassCastException ex) {
                        // Si la propiedad no es numérica, intentamos convertir desde String
                        try {
                            double parsed = Double.parseDouble(String.valueOf(m.getCantidadMaterial()));
                            return parsed >= cantidadMaterial;
                        } catch (Exception e) {
                            return false;
                        }
                    }
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<cmateriales> obtenerMaterialesPaginados(Pageable pageable) {
        return materialRepositorio.findAll(pageable);
    }
}
