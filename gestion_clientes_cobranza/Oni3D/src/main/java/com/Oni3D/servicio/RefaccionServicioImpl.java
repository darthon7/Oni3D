package com.Oni3D.servicio;

import com.Oni3D.model.Refaccion;
import com.Oni3D.repositorio.RefaccionRepositorio;
// import com.Oni3D.repositorio.empleadoRepositorio; // <- ELIMINADO (no se usa)
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class RefaccionServicioImpl implements RefaccionServicio {

    //Inyeccion de dependencias
    private final RefaccionRepositorio refaccionRepositorio;

    //Constructor inyeccion de dependencias
    // CORREGIDO: Se eliminó empleadoRepositorio que no se usaba.
    public RefaccionServicioImpl(RefaccionRepositorio refaccionRepositorio) {
        this.refaccionRepositorio = refaccionRepositorio;
    }

    //Metodo crear refaccion
    @Override
    public Refaccion crearRefaccion(Refaccion refaccion) {
        return refaccionRepositorio.save(refaccion);
    }

    //Metodo actualizar refaccion
    @Override
    public Refaccion actualizarRefaccion(Long idRefaccion, Refaccion refaccionActualizado) {
        Refaccion refaccionExistente = refaccionRepositorio.findById(idRefaccion)
                .orElseThrow(() -> new RuntimeException("Refaccion no encontrada"));

        refaccionExistente.setNombre(refaccionActualizado.getNombre());
        refaccionExistente.setMarca(refaccionActualizado.getMarca());
        refaccionExistente.setDescripcion(refaccionActualizado.getDescripcion());
        refaccionExistente.setPrecio(refaccionActualizado.getPrecio());
        refaccionExistente.setStock(refaccionActualizado.getStock());
        refaccionExistente.setImageFilename(refaccionActualizado.getImageFilename());

        return refaccionRepositorio.save(refaccionExistente);
    }


    //Metodo obtener refaccion por id
    @Override
    @Transactional(readOnly = true)
    public Refaccion obtenerRefaccionPorId(Long idRefaccion) {
        return refaccionRepositorio.findById(idRefaccion)
                .orElseThrow(() -> new RuntimeException("Refaccion no encontrada" + idRefaccion));
    }

    @Override
    public void eliminarRefaccion(Long idRefaccion) {
        Refaccion refaccionExistente = refaccionRepositorio.findById(idRefaccion)
                // CORREGIDO: Asumiendo que no tienes 'ResourceNotFoundException',
                // usamos RuntimeException como en los otros métodos.
                .orElseThrow(() -> new RuntimeException("Refaccion no se encontro con id: " + idRefaccion));

        // CORREGIDO: Faltaba la línea para eliminar la refacción.
        refaccionRepositorio.delete(refaccionExistente);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Refaccion> obtenerTodasLasRefacciones() {
        // CORREGIDO: El método es findAll() (ya viene en JpaRepository)
        return refaccionRepositorio.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Refaccion> buscarRefaccionPorNombre(String nombre) {
        // CORREGIDO: Era findByNombre (con 'B' mayúscula)
        return refaccionRepositorio.findByNombre(nombre);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Refaccion> buscarRefaccionPorMarca(String marca) {
        return refaccionRepositorio.findByMarca(marca);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Refaccion> buscarRefaccionPorStock(Long stock) {
        return refaccionRepositorio.findByStock(stock);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Refaccion> buscarRefaccionPorPrecio(double precio) {
        // CORREGIDO: Era findByPrecio (con 'B' mayúscula)
        return refaccionRepositorio.findByPrecio(precio);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Refaccion> buscarRefaccionPorDescripcion(String descripcion) {
        return refaccionRepositorio.findByDescripcion(descripcion);
    }

    @Override
    public Page<Refaccion> obtenerRefaccionesPaginadas(Pageable pageable) {
        // CORREGIDO: Implementado el método que devolvía null.
        return refaccionRepositorio.findAll(pageable);
    }
}