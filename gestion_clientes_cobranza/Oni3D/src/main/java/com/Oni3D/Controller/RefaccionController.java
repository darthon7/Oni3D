package com.Oni3D.Controller;


import com.Oni3D.model.Refaccion;
import com.Oni3D.servicio.RefaccionServicio;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;
// ... tus otras importaciones
import org.springframework.http.HttpStatus;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import java.net.URI;
import java.util.List;
@RestController
@RequestMapping("/api/refacciones")
@CrossOrigin(origins ="*")
public class RefaccionController {

    //
    private final RefaccionServicio refaccionServicio;
    private final Path uploadDir = Paths.get("uploads");
    public RefaccionController(RefaccionServicio refaccionServicio) {
        this.refaccionServicio = refaccionServicio;
    }


    /**
     * Crear una nueva refaccion
     */
    @PostMapping
    public ResponseEntity<Refaccion> crearRefaccion(@RequestBody Refaccion refaccion) {
        Refaccion refaccionGuardada = refaccionServicio.crearRefaccion(refaccion);

        URI location = URI.create(String.format("/api/refacciones/%s", refaccionGuardada.getId()));
        return ResponseEntity.created(location).body(refaccion);
    }
    /**
     * Obtener la lista de refacciones
     */
    @GetMapping
    public ResponseEntity<List <Refaccion>> obtenerTodasLasRefacciones() {
        List<Refaccion> refacciones = refaccionServicio.obtenerTodasLasRefacciones();
        return ResponseEntity.ok(refacciones);
    }

    /**
     * Obtener refaccion paginada
     */
    @GetMapping("/pagina")
    public ResponseEntity<Page<Refaccion>> obtenerRefaccionesPaginadas(@PageableDefault(size = 10) Pageable pageable) {
        Page <Refaccion> page = refaccionServicio.obtenerRefaccionesPaginadas(pageable);
        return ResponseEntity.ok(page);
    }
    /**
     * Obtener refaccion por ID
     */

    @GetMapping("/{id}")
    public ResponseEntity<Refaccion> obtenerRefaccionPorId(@PathVariable ("id")Long idRefaccion) {
        Refaccion refaccion = refaccionServicio.obtenerRefaccionPorId(idRefaccion);
        return ResponseEntity.ok(refaccion);
    }

    /**
     * Actualizar una refaccion
     */
    @PutMapping("/{id}")
    public ResponseEntity<Refaccion> actualizarRefaccion(@PathVariable("id")Long idRefaccion,
                                                         @RequestBody Refaccion refaccionActualizado){

        Refaccion actualizada = refaccionServicio.actualizarRefaccion(idRefaccion, refaccionActualizado);
        return ResponseEntity.ok(actualizada);

        }
    /**
     * Eliminar una refaccion
     */

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarRefaccion(@PathVariable("id")Long idRefaccion){
        refaccionServicio.eliminarRefaccion(idRefaccion);
        return ResponseEntity.ok().build();
    }

    /**
     * Buscar refaccion por nombre
     */
    @GetMapping("/buscar/nombre")
    public ResponseEntity<List<Refaccion>> buscarRefaccionPorNombre(@RequestParam("nombre") String nombre){
        List<Refaccion> refacciones = refaccionServicio.buscarRefaccionPorNombre(nombre);
        return ResponseEntity.ok(refacciones);
    }

    /**
     * Buscar refaccion por precio
     */
    @GetMapping("/buscar/precio")
    public ResponseEntity<List<Refaccion>> buscarRefaccionPorPrecio(@RequestParam("precio") Double precio){
        List<Refaccion> refacciones = refaccionServicio.buscarRefaccionPorPrecio(precio);
        return ResponseEntity.ok(refacciones);
    }

    /**
     * Buscar refaccion por marca
     */
    @GetMapping("/buscar/marca")
    public ResponseEntity<List<Refaccion>> buscarRefaccionPorMarca(@RequestParam("marca") String marca){
        List<Refaccion> refacciones = refaccionServicio.buscarRefaccionPorMarca(marca);
        return ResponseEntity.ok(refacciones);
    }


    @PostMapping("/upload-image")
    public ResponseEntity<String> uploadImage(@RequestParam("image") MultipartFile file) {

        // 1. Validar que el archivo no esté vacío
        if (file.isEmpty()) {
            // Este es el return si el archivo está vacío
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Por favor, seleccione un archivo para subir.");
        }

        try {
            // 2. Asegurarse de que el directorio "uploads" exista
            Files.createDirectories(uploadDir);

            // 3. Crear un nombre de archivo único
            String uniqueFilename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = uploadDir.resolve(uniqueFilename);

            // 4. Copiar el archivo al directorio de destino
            Files.copy(file.getInputStream(), filePath);

            // 5. Devolver la URL o el nombre del archivo como respuesta
            String fileUrl = "/uploads/" + uniqueFilename;

            // Este es el return si todo salió bien
            return ResponseEntity.ok(fileUrl);

        } catch (IOException e) {
            // 6. Manejar errores si no se puede guardar el archivo
            // Este es el return si ocurre una excepción
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al guardar el archivo: " + e.getMessage());
        }
    }












}
