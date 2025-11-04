package com.Oni3D.repositorio;

import com.Oni3D.model.Impresora;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImpresoraRepository extends JpaRepository<Impresora, Long> {
    // Aquí puedes añadir métodos de búsqueda personalizados si los necesitas
    // Ej: List<Impresora> findByMarca(String marca);
}