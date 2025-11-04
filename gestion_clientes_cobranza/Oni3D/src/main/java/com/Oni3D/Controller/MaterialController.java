package com.Oni3D.Controller;

import com.Oni3D.model.cmateriales;
import com.Oni3D.servicio.materialServicio;
import com.Oni3D.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

/**
 * Controlador REST para gestionar cmateriales.
 */
@RestController
@RequestMapping("/api/materiales")
@CrossOrigin(origins = "*") // Ajusta orígenes según políticas de seguridad
public class MaterialController {

    private final materialServicio materialServicio;

    public MaterialController(materialServicio materialServicio) {
        this.materialServicio = materialServicio;
    }

    /**
     * Crear un nuevo material.
     * POST /api/materiales
     */
    @PostMapping
    public ResponseEntity<cmateriales> crearMaterial(@RequestBody cmateriales material) {
        cmateriales creado = materialServicio.crearMaterial(material);
        URI location = URI.create(String.format("/api/materiales/%s", creado.getIdMaterial()));
        return ResponseEntity.created(location).body(creado);
    }

    /**
     * Obtener todos los materiales (lista completa).
     * GET /api/materiales
     */
    @GetMapping
    public ResponseEntity<List<cmateriales>> obtenerTodosLosMateriales() {
        List<cmateriales> lista = materialServicio.obtenerTodosLosMateriales();
        return ResponseEntity.ok(lista);
    }

    /**
     * Obtener materiales paginados.
     * GET /api/materiales/pagina
     * Ejemplo: /api/materiales/pagina?page=0&size=10&sort=nombreMaterial,asc
     */
    @GetMapping("/pagina")
    public ResponseEntity<Page<cmateriales>> obtenerMaterialesPaginados(@PageableDefault(size = 10) Pageable pageable) {
        Page<cmateriales> page = materialServicio.obtenerMaterialesPaginados(pageable);
        return ResponseEntity.ok(page);
    }

    /**
     * Obtener un material por id.
     * GET /api/materiales/{id}
     */
    @GetMapping("/{idMaterial}")
    public ResponseEntity<cmateriales> obtenerMaterialPorId(@PathVariable("idMaterial") Long idMaterial) {
        cmateriales material = materialServicio.obtenerMaterialPorId(idMaterial);
        return ResponseEntity.ok(material);
    }

    /**
     * Actualizar un material existente.
     * PUT /api/materiales/{id}
     */
    @PutMapping("/{idMaterial}")
    public ResponseEntity<cmateriales> actualizarMaterial(@PathVariable("idMaterial") Long idMaterial,
                                                          @RequestBody cmateriales materialActualizado) {
        cmateriales actualizado = materialServicio.actualizarMaterial(idMaterial, materialActualizado);
        return ResponseEntity.ok(actualizado);
    }

    /**
     * Eliminar un material.
     * DELETE /api/materiales/{id}
     */
    @DeleteMapping("/{idMaterial}")
    public ResponseEntity<Void> eliminarMaterial(@PathVariable("idMaterial") Long idMaterial) {
        materialServicio.eliminarMaterial(idMaterial);
        return ResponseEntity.noContent().build();
    }

    /**
     * Buscar materiales por nombre (contiene, case-insensitive).
     * GET /api/materiales/buscar/nombre?nombre=xxx
     */
    @GetMapping("/buscar/nombre")
    public ResponseEntity<List<cmateriales>> buscarPorNombre(@RequestParam("nombre") String nombre) {
        List<cmateriales> resultados = materialServicio.buscarPorNombreMaterial(nombre);
        return ResponseEntity.ok(resultados);
    }

    /**
     * Buscar materiales por precio (comparación por igualdad de string/valor según implementación del servicio).
     * GET /api/materiales/buscar/precio?precio=123.45
     */
    @GetMapping("/buscar/precio")
    public ResponseEntity<List<cmateriales>> buscarPorPrecio(@RequestParam("precio") String precio) {
        List<cmateriales> resultados = materialServicio.buscarPorprecioMaterial(precio);
        return ResponseEntity.ok(resultados);
    }

    /**
     * Buscar materiales por cantidad (mayor o igual a la cantidad dada).
     * GET /api/materiales/buscar/cantidad?cantidad=10
     */
    @GetMapping("/buscar/cantidad")
    public ResponseEntity<List<cmateriales>> buscarPorCantidad(@RequestParam("cantidad") double cantidad) {
        List<cmateriales> resultados = materialServicio.buscarPorCantidadMaterial(cantidad);
        return ResponseEntity.ok(resultados);
    }
}
