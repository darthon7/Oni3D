package com.Oni3D.servicio;

import com.Oni3D.model.Refaccion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface RefaccionServicio {


    Refaccion crearRefaccion (Refaccion refaccion);

    Refaccion actualizarRefaccion (Long idRefaccion, Refaccion refaccionActualizado);

    Refaccion obtenerRefaccionPorId (Long idRefaccion);

    void eliminarRefaccion(Long idRefaccion);

    List<Refaccion> obtenerTodasLasRefacciones();

    List<Refaccion> buscarRefaccionPorNombre(String nombre);

    List<Refaccion> buscarRefaccionPorMarca(String marca);

    List<Refaccion> buscarRefaccionPorStock(Long stock);

    List<Refaccion> buscarRefaccionPorPrecio(double precio);

    List<Refaccion> buscarRefaccionPorDescripcion(String descripcion);


    Page<Refaccion> obtenerRefaccionesPaginadas(Pageable pageable);
}
