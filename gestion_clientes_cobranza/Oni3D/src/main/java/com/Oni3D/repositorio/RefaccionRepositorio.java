package com.Oni3D.repositorio;

import com.Oni3D.model.Refaccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RefaccionRepositorio extends JpaRepository<Refaccion, Long> {

    /**
     ***Buscar Refaccion por nombre
     */
    // CORREGIDO: findByNombre (con 'B' mayúscula)
    List<Refaccion> findByNombre(String nombre);

    /**
     ***Buscar Refaccion por Precio
     */
    // CORRECTO: Este ya estaba bien
    List<Refaccion> findByPrecio(double precio);

    /**
     ***Buscar Refaccion por Marca
     */
    List <Refaccion> findByMarca(String marca);

    /**
     ***Buscar Refaccion por Descripcion
     */
    List<Refaccion> findByDescripcion(String descripcion);

    /**
     ***Buscar Refaccion por ID
     */
    // NOTA: JpaRepository ya te da un método "findById(Long id)"
    // pero si tu campo se llama "idRefaccion", este está bien.
    /**
     ***Buscar Refaccion por Stock
     */
    List<Refaccion> findByStock(Long stock);

    List<Refaccion> findAll();

    // ELIMINADO: findByAll() no es un método válido. Usa findAll() (ya incluido).

}