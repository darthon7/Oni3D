package com.Oni3D.servicio;



import com.Oni3D.exception.ResourceNotFoundException;
import com.Oni3D.model.Producto;
import com.Oni3D.repositorio.ProductoRepositorio;
// Ya no es necesario importar ProductoServicio aquí si no se usa internamente
// import com.Oni3D.servicio.ProductoServicio;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger; // Importar Logger
import org.slf4j.LoggerFactory; // Importar LoggerFactory

import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true) // Lectura por defecto
public class ProductoServicioImpl implements ProductoServicio {

    // Añadir Logger
    private static final Logger log = LoggerFactory.getLogger(ProductoServicioImpl.class);

    private final ProductoRepositorio productoRepositorio;

    // Inyección por constructor (recomendado)
    public ProductoServicioImpl(ProductoRepositorio productoRepositorio) {
        this.productoRepositorio = productoRepositorio;
    }

    @Override
    public List<Producto> findAll() {
        log.info("Buscando todos los productos");
        return productoRepositorio.findAll();
    }

    @Override
    public Optional<Producto> findById(Long id) {
        log.info("Buscando producto por ID: {}", id);
        return productoRepositorio.findById(id);
    }

    @Override
    @Transactional // Sobrescribir para operaciones de escritura
    public Producto save(Producto producto) {
        log.info("Guardando nuevo producto: {}", producto.getDescripcion());
        // Validaciones básicas (se mantienen)
        if (producto.getPrecio() == null) {
            producto.setPrecio(0.0);
        }
        if (producto.getStock() == null) {
            producto.setStock(0);
        }
        // No necesitamos validar imageFilename aquí, puede ser nulo
        return productoRepositorio.save(producto);
    }

    @Override
    @Transactional // Sobrescribir para operaciones de escritura
    public Producto update(Long id, Producto productoConNuevosDatos) {
        log.info("Actualizando producto con ID: {}", id);
        // Buscar el producto existente
        Producto existente = productoRepositorio.findById(id)
                .orElseThrow(() -> {
                    log.error("Producto no encontrado para actualizar con ID: {}", id);
                    return new ResourceNotFoundException("Producto", "id", id);
                });

        // Actualiza campos permitidos copiando desde productoConNuevosDatos
        log.debug("Datos recibidos para actualizar: Precio={}, Stock={}, Desc={}, Img={}",
                productoConNuevosDatos.getPrecio(), productoConNuevosDatos.getStock(),
                productoConNuevosDatos.getDescripcion(), productoConNuevosDatos.getImageFilename());

        existente.setPrecio(productoConNuevosDatos.getPrecio());
        existente.setStock(productoConNuevosDatos.getStock());
        existente.setDescripcion(productoConNuevosDatos.getDescripcion());

        // --- CORRECCIÓN AQUÍ ---
        // Actualizar el nombre del archivo de imagen usando el método correcto
        existente.setImageFilename(productoConNuevosDatos.getImageFilename());
        // --- FIN CORRECCIÓN ---

        log.info("Guardando producto actualizado: ID {}", id);
        return productoRepositorio.save(existente); // Guardar la entidad actualizada
    }

    @Override
    @Transactional // Sobrescribir para operaciones de escritura
    public void deleteById(Long id) {
        log.warn("Intentando eliminar producto con ID: {}", id); // Usar warn para operaciones destructivas
        if (!productoRepositorio.existsById(id)) {
            log.error("Producto no encontrado para eliminar con ID: {}", id);
            throw new ResourceNotFoundException("Producto", "id", id);
        }
        productoRepositorio.deleteById(id);
        log.info("Producto eliminado con ID: {}", id);
    }

    @Override
    public List<Producto> findByDescripcionContaining(String texto) {
        log.info("Buscando productos por descripción que contenga: '{}'", texto);
        // Usar IgnoreCase que definiste en el Repositorio
        return productoRepositorio.findByDescripcionContainingIgnoreCase(texto);
    }

    @Override
    public List<Producto> findByPrecioBetween(Double minPrecio, Double maxPrecio) {
        log.info("Buscando productos con precio entre {} y {}", minPrecio, maxPrecio);
        return productoRepositorio.findByPrecioBetween(minPrecio, maxPrecio);
    }

    @Override
    @Transactional // Sobrescribir para operaciones de escritura
    public int updateStockById(Long id, Integer nuevoStock) {
        log.info("Actualizando stock para producto ID {} a {}", id, nuevoStock);
        return productoRepositorio.updateStockById(id, nuevoStock);
    }

    @Override
    @Transactional // Sobrescribir para operaciones de escritura
    public int decreaseStockIfAvailable(Long id, Integer cantidad) {
        log.info("Intentando decrementar stock en {} para producto ID {}", cantidad, id);
        int filasAfectadas = productoRepositorio.decreaseStockIfAvailable(id, cantidad);
        if (filasAfectadas > 0) {
            log.info("Stock decrementado exitosamente para producto ID {}", id);
        } else {
            log.warn("No se pudo decrementar stock para producto ID {} (stock insuficiente o ID no encontrado)", id);
        }
        return filasAfectadas;
    }
}

