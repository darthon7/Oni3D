package com.Oni3D.Controller;

import com.Oni3D.model.cEmpleados;
import com.Oni3D.servicio.empleadoServicio;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

/**
 * Controlador REST para la entidad cEmpleado.
 */
@RestController
@RequestMapping("/api/empleados")
@CrossOrigin(origins = "*") // Ajusta el origen según tus necesidades de seguridad
public class EmpleadoController {

    private final empleadoServicio empleadoServicio;

    public EmpleadoController(empleadoServicio empleadoServicio) {
        this.empleadoServicio = empleadoServicio;
    }

    /**
     * Crear un nuevo empleado.
     */
    @PostMapping
    public ResponseEntity<cEmpleados> crearEmpleado(@RequestBody cEmpleados empleado) {
        cEmpleados creado = empleadoServicio.crearEmpleado(empleado);
        // Construir Location header opcional:
        URI location = URI.create(String.format("/api/empleados/%s", creado.getIdEmpleado()));
        return ResponseEntity.created(location).body(creado);
    }

    /**
     * Obtener la lista completa de empleados.
     */
    @GetMapping
    public ResponseEntity<List<cEmpleados>> obtenerTodosLosEmpleados() {
        List<cEmpleados> lista = empleadoServicio.obtenerTodosLosEmpleados();
        return ResponseEntity.ok(lista);
    }

    /**
     * Obtener empleados paginados.
     * Ejemplo: /api/empleados/pagina?page=0&size=10&sort=nombre,asc
     */
    @GetMapping("/pagina")
    public ResponseEntity<Page<cEmpleados>> obtenerEmpleadosPaginados(@PageableDefault(size = 10) Pageable pageable) {
        Page<cEmpleados> page = empleadoServicio.obtenerEmpleadosPaginados(pageable);
        return ResponseEntity.ok(page);
    }

    /**
     * Obtener un empleado por su id.
     */
    @GetMapping("/{id}")
    public ResponseEntity<cEmpleados> obtenerEmpleadoPorId(@PathVariable("id") Long idEmpleado) {
        cEmpleados empleado = empleadoServicio.obtenerEmpleadoPorId(idEmpleado);
        return ResponseEntity.ok(empleado);
    }

    /**
     * Actualizar un empleado existente.
     */
    @PutMapping("/{id}")
    public ResponseEntity<cEmpleados> actualizarEmpleado(@PathVariable("id") Long idEmpleado,
                                                         @RequestBody cEmpleados empleadoActualizado) {
        cEmpleados actualizado = empleadoServicio.actualizarEmpleado(idEmpleado, empleadoActualizado);
        return ResponseEntity.ok(actualizado);
    }

    /**
     * Eliminar un empleado.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarEmpleado(@PathVariable("id") Long idEmpleado) {
        empleadoServicio.eliminarEmpleado(idEmpleado);
        return ResponseEntity.noContent().build();
    }

    /**
     * Buscar por nombre (exact match).
     * Ejemplo: /api/empleados/buscar/nombre?nombre=Juan
     */
    @GetMapping("/buscar/nombre")
    public ResponseEntity<List<cEmpleados>> buscarPorNombre(@RequestParam("nombre") String nombre) {
        List<cEmpleados> resultado = empleadoServicio.buscarPorNombre(nombre);
        return ResponseEntity.ok(resultado);
    }

    /**
     * Buscar por departamento (exact match).
     * Ejemplo: /api/empleados/buscar/departamento?departamento=Ventas
     */
    @GetMapping("/buscar/departamento")
    public ResponseEntity<List<cEmpleados>> buscarPorDepartamento(@RequestParam("departamento") String departamento) {
        List<cEmpleados> resultado = empleadoServicio.buscarPorDepartamento(departamento);
        return ResponseEntity.ok(resultado);
    }

    /**
     * Buscar empleados con sueldo mayor que el valor indicado.
     * Ejemplo: /api/empleados/buscar/sueldoMayor?sueldo=20000
     */
    @GetMapping("/buscar/sueldoMayor")
    public ResponseEntity<List<cEmpleados>> buscarPorSueldoMayorQue(@RequestParam("sueldo") double sueldo) {
        List<cEmpleados> resultado = empleadoServicio.buscarPorSueldoMayorQue(sueldo);
        return ResponseEntity.ok(resultado);
    }



}

