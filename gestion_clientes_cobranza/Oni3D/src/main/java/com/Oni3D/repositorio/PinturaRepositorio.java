package com.Oni3D.repositorio;

import com.Oni3D.model.Pintura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PinturaRepositorio extends JpaRepository<Pintura, Long> {

    /**
     * Busca todas las pinturas que contengan una cadena en la marca, ignorando mayúsculas/minúsculas.
     * @param marca La cadena de la marca a buscar.
     * @return Una lista de pinturas que coinciden.
     */
    List<Pintura> findByMarcaContainingIgnoreCase(String marca);

    /**
     * Busca todas las pinturas que contengan una cadena en el color, ignorando mayúsculas/minúsculas.
     * @param color La cadena del color a buscar.
     * @return Una lista de pinturas que coinciden.
     */
    List<Pintura> findByColorContainingIgnoreCase(String color);

    /**
     * Busca todas las pinturas que coincidan con una marca Y un color.
     * @param marca La marca exacta.
     * @param color El color exacto.
     * @return Una lista de pinturas que coinciden.
     */
    List<Pintura> findByMarcaAndColorContainingIgnoreCase(String marca, String color);
}
