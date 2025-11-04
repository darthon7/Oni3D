package com.Oni3D.servicio;

import com.Oni3D.model.*;
import com.Oni3D.repositorio.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class DataBaseActionService {

    @Autowired
    private PinturaRepositorio pinturaRepositorio;

    @Autowired
    private ProductoRepositorio productoRepositorio;

    @Autowired
    private empleadoRepositorio empleadoRepositorio;

    @Autowired
    private materialesRepositorio materialesRepositorio;

    @Autowired
    private UsuarioRepositorio usuarioRepositorio;

    @Autowired
    private EventoRepositorio eventoRepositorio;

    /**
     * Ejecuta una acción CRUD basada en parámetros estructurados
     */
    @Transactional
    public Map<String, Object> ejecutarAccion(String accion, String entidad, Map<String, Object> datos) {
        Map<String, Object> resultado = new HashMap<>();

        try {
            switch (accion.toUpperCase()) {
                case "CREAR":
                    resultado = crearEntidad(entidad, datos);
                    break;
                case "LEER":
                    resultado = leerEntidad(entidad, datos);
                    break;
                case "ACTUALIZAR":
                    resultado = actualizarEntidad(entidad, datos);
                    break;
                case "ELIMINAR":
                    resultado = eliminarEntidad(entidad, datos);
                    break;
                default:
                    resultado.put("exito", false);
                    resultado.put("mensaje", "Acción no reconocida: " + accion);
            }
        } catch (Exception e) {
            resultado.put("exito", false);
            resultado.put("mensaje", "Error: " + e.getMessage());
        }

        return resultado;
    }

    // ==================== CREAR ====================

    private Map<String, Object> crearEntidad(String entidad, Map<String, Object> datos) {
        Map<String, Object> resultado = new HashMap<>();

        switch (entidad.toUpperCase()) {
            case "PINTURA":
                Pintura pintura = new Pintura();
                pintura.setMarca((String) datos.get("marca"));
                pintura.setColor((String) datos.get("color"));

                Pintura pinturaGuardada = pinturaRepositorio.save(pintura);
                resultado.put("exito", true);
                resultado.put("mensaje", "Pintura creada exitosamente");
                resultado.put("id", pinturaGuardada.getId());
                resultado.put("datos", pinturaGuardada);
                break;

            case "PRODUCTO":
                Producto producto = new Producto();
                producto.setDescripcion((String) datos.get("descripcion"));
                producto.setPrecio(Double.parseDouble(datos.get("precio").toString()));
                producto.setStock(Integer.parseInt(datos.get("stock").toString()));

                Producto productoGuardado = productoRepositorio.save(producto);
                resultado.put("exito", true);
                resultado.put("mensaje", "Producto creado exitosamente");
                resultado.put("id", productoGuardado.getIdProducto());
                resultado.put("datos", productoGuardado);
                break;

            case "EMPLEADO":
                cEmpleados empleado = new cEmpleados();
                empleado.setNombre((String) datos.get("nombre"));
                empleado.setDepartamento((String) datos.get("departamento"));
                empleado.setSueldo(Double.parseDouble(datos.get("sueldo").toString()));

                cEmpleados empleadoGuardado = empleadoRepositorio.save(empleado);
                resultado.put("exito", true);
                resultado.put("mensaje", "Empleado creado exitosamente");
                resultado.put("id", empleadoGuardado.getIdEmpleado());
                resultado.put("datos", empleadoGuardado);
                break;

            case "MATERIAL":
                cmateriales material = new cmateriales();
                material.setNombreMaterial((String) datos.get("nombre"));
                material.setPrecioMaterial(String.valueOf(Double.parseDouble(datos.get("precio").toString())));
                material.setCantidadMaterial(Double.parseDouble(datos.get("cantidad").toString()));

                cmateriales materialGuardado = materialesRepositorio.save(material);
                resultado.put("exito", true);
                resultado.put("mensaje", "Material creado exitosamente");
                resultado.put("id", materialGuardado.getIdMaterial());
                resultado.put("datos", materialGuardado);
                break;

            default:
                resultado.put("exito", false);
                resultado.put("mensaje", "Entidad no reconocida: " + entidad);
        }

        return resultado;
    }

    // ==================== LEER ====================

    private Map<String, Object> leerEntidad(String entidad, Map<String, Object> datos) {
        Map<String, Object> resultado = new HashMap<>();

        switch (entidad.toUpperCase()) {
            case "PINTURA":
                if (datos.containsKey("id")) {
                    Long id = Long.parseLong(datos.get("id").toString());
                    Optional<Pintura> pintura = pinturaRepositorio.findById(id);
                    if (pintura.isPresent()) {
                        resultado.put("exito", true);
                        resultado.put("datos", pintura.get());
                    } else {
                        resultado.put("exito", false);
                        resultado.put("mensaje", "Pintura no encontrada");
                    }
                } else {
                    List<Pintura> pinturas = pinturaRepositorio.findAll();
                    resultado.put("exito", true);
                    resultado.put("datos", pinturas);
                    resultado.put("total", pinturas.size());
                }
                break;

            case "PRODUCTO":
                if (datos.containsKey("id")) {
                    Long id = Long.parseLong(datos.get("id").toString());
                    Optional<Producto> producto = productoRepositorio.findById(id);
                    if (producto.isPresent()) {
                        resultado.put("exito", true);
                        resultado.put("datos", producto.get());
                    } else {
                        resultado.put("exito", false);
                        resultado.put("mensaje", "Producto no encontrado");
                    }
                } else {
                    List<Producto> productos = productoRepositorio.findAll();
                    resultado.put("exito", true);
                    resultado.put("datos", productos);
                    resultado.put("total", productos.size());
                }
                break;

            case "EMPLEADO":
                if (datos.containsKey("id")) {
                    Long id = Long.parseLong(datos.get("id").toString());
                    Optional<cEmpleados> empleado = empleadoRepositorio.findById(id);
                    if (empleado.isPresent()) {
                        resultado.put("exito", true);
                        resultado.put("datos", empleado.get());
                    } else {
                        resultado.put("exito", false);
                        resultado.put("mensaje", "Empleado no encontrado");
                    }
                } else {
                    List<cEmpleados> empleados = empleadoRepositorio.findAll();
                    resultado.put("exito", true);
                    resultado.put("datos", empleados);
                    resultado.put("total", empleados.size());
                }
                break;

            case "MATERIAL":
                if (datos.containsKey("id")) {
                    Long id = Long.parseLong(datos.get("id").toString());
                    Optional<cmateriales> material = materialesRepositorio.findById(id);
                    if (material.isPresent()) {
                        resultado.put("exito", true);
                        resultado.put("datos", material.get());
                    } else {
                        resultado.put("exito", false);
                        resultado.put("mensaje", "Material no encontrado");
                    }
                } else {
                    List<cmateriales> materiales = materialesRepositorio.findAll();
                    resultado.put("exito", true);
                    resultado.put("datos", materiales);
                    resultado.put("total", materiales.size());
                }
                break;

            default:
                resultado.put("exito", false);
                resultado.put("mensaje", "Entidad no reconocida: " + entidad);
        }

        return resultado;
    }

    // ==================== ACTUALIZAR ====================

    private Map<String, Object> actualizarEntidad(String entidad, Map<String, Object> datos) {
        Map<String, Object> resultado = new HashMap<>();

        if (!datos.containsKey("id")) {
            resultado.put("exito", false);
            resultado.put("mensaje", "Se requiere un ID para actualizar");
            return resultado;
        }

        Long id = Long.parseLong(datos.get("id").toString());

        switch (entidad.toUpperCase()) {
            case "PINTURA":
                Optional<Pintura> pinturaOpt = pinturaRepositorio.findById(id);
                if (pinturaOpt.isPresent()) {
                    Pintura pintura = pinturaOpt.get();
                    if (datos.containsKey("marca")) pintura.setMarca((String) datos.get("marca"));
                    if (datos.containsKey("color")) pintura.setColor((String) datos.get("color"));

                    Pintura actualizada = pinturaRepositorio.save(pintura);
                    resultado.put("exito", true);
                    resultado.put("mensaje", "Pintura actualizada exitosamente");
                    resultado.put("datos", actualizada);
                } else {
                    resultado.put("exito", false);
                    resultado.put("mensaje", "Pintura no encontrada");
                }
                break;

            case "PRODUCTO":
                Optional<Producto> productoOpt = productoRepositorio.findById(id);
                if (productoOpt.isPresent()) {
                    Producto producto = productoOpt.get();
                    if (datos.containsKey("descripcion")) producto.setDescripcion((String) datos.get("descripcion"));
                    if (datos.containsKey("precio")) producto.setPrecio(Double.parseDouble(datos.get("precio").toString()));
                    if (datos.containsKey("stock")) producto.setStock(Integer.parseInt(datos.get("stock").toString()));

                    Producto actualizado = productoRepositorio.save(producto);
                    resultado.put("exito", true);
                    resultado.put("mensaje", "Producto actualizado exitosamente");
                    resultado.put("datos", actualizado);
                } else {
                    resultado.put("exito", false);
                    resultado.put("mensaje", "Producto no encontrado");
                }
                break;

            case "EMPLEADO":
                Optional<cEmpleados> empleadoOpt = empleadoRepositorio.findById(id);
                if (empleadoOpt.isPresent()) {
                    cEmpleados empleado = empleadoOpt.get();
                    if (datos.containsKey("nombre")) empleado.setNombre((String) datos.get("nombre"));
                    if (datos.containsKey("departamento")) empleado.setDepartamento((String) datos.get("departamento"));
                    if (datos.containsKey("sueldo")) empleado.setSueldo(Double.parseDouble(datos.get("sueldo").toString()));

                    cEmpleados actualizado = empleadoRepositorio.save(empleado);
                    resultado.put("exito", true);
                    resultado.put("mensaje", "Empleado actualizado exitosamente");
                    resultado.put("datos", actualizado);
                } else {
                    resultado.put("exito", false);
                    resultado.put("mensaje", "Empleado no encontrado");
                }
                break;

            case "MATERIAL":
                Optional<cmateriales> materialOpt = materialesRepositorio.findById(id);
                if (materialOpt.isPresent()) {
                    cmateriales material = materialOpt.get();
                    if (datos.containsKey("nombre")) material.setNombreMaterial((String) datos.get("nombre"));
                    if (datos.containsKey("precio")) material.setPrecioMaterial(String.valueOf(Double.parseDouble(datos.get("precio").toString())));
                    if (datos.containsKey("cantidad")) material.setCantidadMaterial(Double.parseDouble(datos.get("cantidad").toString()));

                    cmateriales actualizado = materialesRepositorio.save(material);
                    resultado.put("exito", true);
                    resultado.put("mensaje", "Material actualizado exitosamente");
                    resultado.put("datos", actualizado);
                } else {
                    resultado.put("exito", false);
                    resultado.put("mensaje", "Material no encontrado");
                }
                break;

            default:
                resultado.put("exito", false);
                resultado.put("mensaje", "Entidad no reconocida: " + entidad);
        }

        return resultado;
    }

    // ==================== ELIMINAR ====================

    private Map<String, Object> eliminarEntidad(String entidad, Map<String, Object> datos) {
        Map<String, Object> resultado = new HashMap<>();

        if (!datos.containsKey("id")) {
            resultado.put("exito", false);
            resultado.put("mensaje", "Se requiere un ID para eliminar");
            return resultado;
        }

        Long id = Long.parseLong(datos.get("id").toString());

        switch (entidad.toUpperCase()) {
            case "PINTURA":
                if (pinturaRepositorio.existsById(id)) {
                    pinturaRepositorio.deleteById(id);
                    resultado.put("exito", true);
                    resultado.put("mensaje", "Pintura eliminada exitosamente");
                } else {
                    resultado.put("exito", false);
                    resultado.put("mensaje", "Pintura no encontrada");
                }
                break;

            case "PRODUCTO":
                if (productoRepositorio.existsById(id)) {
                    productoRepositorio.deleteById(id);
                    resultado.put("exito", true);
                    resultado.put("mensaje", "Producto eliminado exitosamente");
                } else {
                    resultado.put("exito", false);
                    resultado.put("mensaje", "Producto no encontrado");
                }
                break;

            case "EMPLEADO":
                if (empleadoRepositorio.existsById(id)) {
                    empleadoRepositorio.deleteById(id);
                    resultado.put("exito", true);
                    resultado.put("mensaje", "Empleado eliminado exitosamente");
                } else {
                    resultado.put("exito", false);
                    resultado.put("mensaje", "Empleado no encontrado");
                }
                break;

            case "MATERIAL":
                if (materialesRepositorio.existsById(id)) {
                    materialesRepositorio.deleteById(id);
                    resultado.put("exito", true);
                    resultado.put("mensaje", "Material eliminado exitosamente");
                } else {
                    resultado.put("exito", false);
                    resultado.put("mensaje", "Material no encontrado");
                }
                break;

            default:
                resultado.put("exito", false);
                resultado.put("mensaje", "Entidad no reconocida: " + entidad);
        }

        return resultado;
    }
}