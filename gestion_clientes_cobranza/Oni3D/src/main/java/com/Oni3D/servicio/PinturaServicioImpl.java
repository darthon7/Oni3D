package com.Oni3D.servicio;

import com.Oni3D.model.Pintura;
import com.Oni3D.repositorio.PinturaRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Implementación del servicio de Pinturas.
 * Contiene la lógica de negocio y se comunica con el repositorio.
 */
@Service
public class PinturaServicioImpl implements PinturaServicio {

    @Autowired
    private PinturaRepositorio pinturaRepositorio;

    @Override
    public List<Pintura> obtenerTodasLasPinturas() {
        return pinturaRepositorio.findAll();
    }

    @Override
    public Optional<Pintura> obtenerPinturaPorId(Long id) {
        return pinturaRepositorio.findById(id);
    }

    @Override
    public Pintura guardarPintura(Pintura pintura) {
        // Aquí se podría añadir lógica de validación antes de guardar
        return pinturaRepositorio.save(pintura);
    }

    @Override
    public Pintura actualizarPintura(Long id, Pintura detallesPintura) {
        // 1. Buscar la pintura existente
        Pintura pinturaExistente = pinturaRepositorio.findById(id)
                .orElseThrow(() -> new RuntimeException("Pintura no encontrada con id: " + id));

        // 2. Actualizar los campos
        pinturaExistente.setMarca(detallesPintura.getMarca());
        pinturaExistente.setColor(detallesPintura.getColor());
        pinturaExistente.setDescripcion(detallesPintura.getDescripcion());

        // 3. Guardar la pintura actualizada
        return pinturaRepositorio.save(pinturaExistente);
    }

    @Override
    public void eliminarPintura(Long id) {
        // 1. Verificar si existe
        if (!pinturaRepositorio.existsById(id)) {
            throw new RuntimeException("Pintura no encontrada con id: " + id);
        }
        // 2. Eliminar
        pinturaRepositorio.deleteById(id);
    }

    // --- Implementación de métodos de búsqueda ---

    @Override
    public List<Pintura> buscarPorMarca(String marca) {
        return pinturaRepositorio.findByMarcaContainingIgnoreCase(marca);
    }

    @Override
    public List<Pintura> buscarPorColor(String color) {
        return pinturaRepositorio.findByColorContainingIgnoreCase(color);
    }

    @Override
    public List<Pintura> buscarPorMarcaYColor(String marca, String color) {
        return pinturaRepositorio.findByMarcaAndColorContainingIgnoreCase(marca, color);
    }
}
