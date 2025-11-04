package com.Oni3D.Controller;

import com.Oni3D.exception.ResourceNotFoundException;
import com.Oni3D.servicio.ProductoServicio;
import com.Oni3D.model.Producto;
// Ya no necesitamos @Valid ni BindingResult aquí si validamos en el servicio o manualmente
// import jakarta.validation.Valid;
// import org.springframework.validation.BindingResult;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.Map; // Para los DTOs de stock

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*") // O tu origen específico: "http://localhost:5173"
public class ProductoController {

    private final ProductoServicio productoServicio;

    // Inyección de dependencias (sin cambios)
    public ProductoController(ProductoServicio productoServicio) {
        this.productoServicio = productoServicio;
    }

    // Listado completo (sin cambios)
    @GetMapping
    public ResponseEntity<List<Producto>> getAll() {
        List<Producto> productos = productoServicio.findAll();
        return ResponseEntity.ok(productos);
    }

    // Obtener por id (sin cambios)
    @GetMapping("/{id}")
    public ResponseEntity<Producto> getById(@PathVariable Long id) {
        Producto producto = productoServicio.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto", "id", id));
        return ResponseEntity.ok(producto);
    }

    // --- Crear (POST) Modificado ---
    // Ya no usa @RequestBody Producto, sino @RequestParam para cada campo
    @PostMapping
    public ResponseEntity<Producto> create(
            @RequestParam("precio") Double precio,
            @RequestParam("stock") Integer stock,
            @RequestParam(value = "descripcion", required = false) String descripcion, // Descripción opcional
            @RequestParam(value = "imageFilename", required = false) String imageFilename, // Nombre del archivo (opcional)
            UriComponentsBuilder uriBuilder) {

        // Validaciones simples (pueden ir en el servicio)
        if (precio == null || precio < 0) {
            return ResponseEntity.badRequest().build(); // O devolver un mensaje más específico
        }
        if (stock == null || stock < 0) {
            return ResponseEntity.badRequest().build();
        }

        // Crear el objeto Producto manualmente
        Producto nuevoProducto = new Producto();
        nuevoProducto.setPrecio(precio);
        nuevoProducto.setStock(stock);
        nuevoProducto.setDescripcion(descripcion);
        nuevoProducto.setImageFilename(imageFilename); // Asignar el nombre del archivo

        // Guardar usando el servicio
        Producto creado = productoServicio.save(nuevoProducto);

        // Construir la URI de respuesta (sin cambios)
        URI location = uriBuilder.path("/api/productos/{id}")
                .buildAndExpand(creado.getIdProducto())
                .toUri();
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(location);
        return new ResponseEntity<>(creado, headers, HttpStatus.CREATED);
    }

    // --- Actualizar (PUT) Modificado ---
    // Ya no usa @RequestBody Producto, sino @RequestParam
    @PutMapping("/{id}")
    public ResponseEntity<Producto> update(
            @PathVariable Long id,
            @RequestParam("precio") Double precio,
            @RequestParam("stock") Integer stock,
            @RequestParam(value = "descripcion", required = false) String descripcion,
            @RequestParam(value = "imageFilename", required = false) String imageFilename) {

        // Validaciones
        if (precio == null || precio < 0) {
            return ResponseEntity.badRequest().build();
        }
        if (stock == null || stock < 0) {
            return ResponseEntity.badRequest().build();
        }

        // Crear un objeto temporal con los datos recibidos
        // (El servicio se encargará de buscar el existente y copiar los campos)
        Producto datosActualizacion = new Producto();
        datosActualizacion.setPrecio(precio);
        datosActualizacion.setStock(stock);
        datosActualizacion.setDescripcion(descripcion);
        datosActualizacion.setImageFilename(imageFilename);

        // Llamar al método update del servicio
        // Este método buscará el producto por ID y actualizará sus campos
        Producto actualizado = productoServicio.update(id, datosActualizacion);

        return ResponseEntity.ok(actualizado);
    }

    // Eliminar (sin cambios)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productoServicio.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Buscar por descripción (sin cambios)
    @GetMapping("/search")
    public ResponseEntity<List<Producto>> searchByDescripcion(@RequestParam("descripcion") String descripcion) {
        List<Producto> resultados = productoServicio.findByDescripcionContaining(descripcion);
        return ResponseEntity.ok(resultados);
    }

    // Buscar por rango de precio (sin cambios)
    @GetMapping("/range")
    public ResponseEntity<List<Producto>> findByPrecioRange(@RequestParam("min") Double min,
                                                            @RequestParam("max") Double max) {
        List<Producto> resultados = productoServicio.findByPrecioBetween(min, max);
        return ResponseEntity.ok(resultados);
    }

    // Actualizar stock (PATCH) (sin cambios)
    @PatchMapping("/{id}/stock")
    public ResponseEntity<?> updateStock(@PathVariable Long id, @RequestBody StockRequest request) { // Sigue usando DTO
        if (request.getStock() == null || request.getStock() < 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "stock debe ser un entero >= 0"));
        }
        int filas = productoServicio.updateStockById(id, request.getStock());
        if (filas == 0) {
            throw new ResourceNotFoundException("Producto", "id", id);
        }
        return ResponseEntity.ok(Map.of("message", "Stock actualizado")); // Mensaje opcional
    }

    // Decrementar stock (POST) (sin cambios)
    @PostMapping("/{id}/decrease-stock")
    public ResponseEntity<?> decreaseStock(@PathVariable Long id, @RequestBody DecreaseStockRequest request) { // Sigue usando DTO
        if (request.getCantidad() == null || request.getCantidad() <= 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "cantidad debe ser entero > 0"));
        }
        int filas = productoServicio.decreaseStockIfAvailable(id, request.getCantidad());
        if (filas == 0) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "No se pudo decrementar el stock: producto no encontrado o stock insuficiente."));
        }
        return ResponseEntity.ok(Map.of("message", "Stock decrementado")); // Mensaje opcional
    }

    // --- DTOs internos (sin cambios) ---
    // (Sería mejor moverlos a archivos separados)
    public static class StockRequest {
        private Integer stock;
        // Getters y Setters...
        public StockRequest() {}
        public StockRequest(Integer stock) { this.stock = stock; }
        public Integer getStock() { return stock; }
        public void setStock(Integer stock) { this.stock = stock; }
    }

    public static class DecreaseStockRequest {
        private Integer cantidad;
        // Getters y Setters...
        public DecreaseStockRequest() {}
        public DecreaseStockRequest(Integer cantidad) { this.cantidad = cantidad; }
        public Integer getCantidad() { return cantidad; }
        public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
    }
}
