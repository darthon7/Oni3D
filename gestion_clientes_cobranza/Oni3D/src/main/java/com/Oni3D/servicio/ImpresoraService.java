package com.Oni3D.servicio;

import com.Oni3D.model.Impresora;
import com.Oni3D.repositorio.ImpresoraRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ImpresoraService {

    @Autowired
    private ImpresoraRepository impresoraRepository;

    public List<Impresora> getAllImpresoras() {
        return impresoraRepository.findAll();
    }

    public Optional<Impresora> getImpresoraById(Long id) {
        return impresoraRepository.findById(id);
    }

    public Impresora saveImpresora(Impresora impresora) {
        return impresoraRepository.save(impresora);
    }

    public void deleteImpresora(Long id) {
        impresoraRepository.deleteById(id);
    }

    public Impresora updateImpresora(Long id, Impresora detalles) {
        // Lógica para actualizar
        Impresora impresoraExistente = impresoraRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Impresora no encontrada"));

        impresoraExistente.setNombre(detalles.getNombre());
        impresoraExistente.setMarca(detalles.getMarca());
        impresoraExistente.setTamaño(detalles.getTamaño());
        impresoraExistente.setVelocidad(detalles.getVelocidad());

        return impresoraRepository.save(impresoraExistente);
    }
}