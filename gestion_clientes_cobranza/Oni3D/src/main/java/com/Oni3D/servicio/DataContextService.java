package com.Oni3D.servicio;

import com.Oni3D.repositorio.*;
import com.Oni3D.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DataContextService {

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
     * Genera un contexto textual con información de la base de datos
     * para que la IA pueda responder preguntas.
     */
    public String generarContextoCompleto() {
        StringBuilder contexto = new StringBuilder();

        // Información de Pinturas
        List<Pintura> pinturas = pinturaRepositorio.findAll();
        contexto.append("=== PINTURAS ===\n");
        contexto.append("Total de pinturas: ").append(pinturas.size()).append("\n");
        if (!pinturas.isEmpty()) {
            contexto.append("Listado de pinturas:\n");
            for (Pintura p : pinturas) {
                contexto.append("- ID: ").append(p.getId())
                        .append(", Marca: ").append(p.getMarca())
                        .append(", Color: ").append(p.getColor())
                        .append(", Precio: $").append(p.getDescripcion())
                        .append("\n");
            }
        }
        contexto.append("\n");

        // Información de Productos
        List<Producto> productos = productoRepositorio.findAll();
        contexto.append("=== PRODUCTOS ===\n");
        contexto.append("Total de productos: ").append(productos.size()).append("\n");
        if (!productos.isEmpty()) {
            contexto.append("Listado de productos:\n");
            for (Producto p : productos) {
                contexto.append("- ID: ").append(p.getIdProducto())
                        .append(", Descripción: ").append(p.getDescripcion())
                        .append(", Precio: $").append(p.getPrecio())
                        .append(", Stock: ").append(p.getStock())
                        .append("\n");
            }
        }
        contexto.append("\n");

        // Información de Empleados
        List<cEmpleados> empleados = empleadoRepositorio.findAll();
        contexto.append("=== Clientes ===\n");
        contexto.append("Total de clientes: ").append(empleados.size()).append("\n");
        if (!empleados.isEmpty()) {
            contexto.append("Listado de clientes:\n");
            for (cEmpleados e : empleados) {
                contexto.append("{ ID: ").append(e.getIdEmpleado())
                        .append(", Nombre: ").append(e.getNombre())
                        .append(", Correo: ").append(e.getDepartamento())
                        .append(", Telefono }").append(e.getSueldo())
                        .append("} \n");
            }
        }
        contexto.append("\n");

        // Información de Materiales
        List<cmateriales> materiales = materialesRepositorio.findAll();
        contexto.append("=== MATERIALES ===\n");
        contexto.append("Total de materiales: ").append(materiales.size()).append("\n");
        if (!materiales.isEmpty()) {
            contexto.append("Listado de materiales:\n");
            for (cmateriales m : materiales) {
                contexto.append("- ID: ").append(m.getIdMaterial())
                        .append(", Nombre: ").append(m.getNombreMaterial())
                        .append(", Precio: $").append(m.getPrecioMaterial())
                        .append(", Cantidad: ").append(m.getCantidadMaterial())
                        .append("\n");
            }
        }
        contexto.append("\n");

        // Información de Usuarios
        long totalUsuarios = usuarioRepositorio.count();
        contexto.append("=== USUARIOS ===\n");
        contexto.append("Total de usuarios registrados: ").append(totalUsuarios).append("\n\n");

        // Información de Eventos
        List<Evento> eventos = eventoRepositorio.findAll();
        contexto.append("=== EVENTOS ===\n");
        contexto.append("Total de eventos: ").append(eventos.size()).append("\n");
        if (!eventos.isEmpty()) {
            contexto.append("Listado de eventos:\n");
            for (Evento ev : eventos) {
                contexto.append("- ID: ").append(ev.getId())
                        .append(", Título: ").append(ev.getTitulo())
                        .append(", Fecha: ").append(ev.getFechaNotificacion())
                        .append(", Notificado: ").append(ev.isNotificado() ? "Sí" : "No")
                        .append("\n");
            }
        }

        return contexto.toString();
    }

    /**
     * Genera contexto específico basado en palabras clave de la pregunta
     */
    public String generarContextoInteligente(String pregunta) {
        String preguntaLower = pregunta.toLowerCase();
        StringBuilder contexto = new StringBuilder();

        // Si pregunta sobre pinturas
        if (preguntaLower.contains("pintura")) {
            List<Pintura> pinturas = pinturaRepositorio.findAll();
            contexto.append("=== INFORMACIÓN DE PINTURAS ===\n");
            contexto.append("Total: ").append(pinturas.size()).append("\n");
            for (Pintura p : pinturas) {
                contexto.append("Marca: ").append(p.getMarca())
                        .append("Color: ").append(p.getColor())
                        .append("Descripcion: ").append(p.getDescripcion())
                        .append("\n");
            }
        }

        // Si pregunta sobre productos
        if (preguntaLower.contains("producto")) {
            List<Producto> productos = productoRepositorio.findAll();
            contexto.append("=== INFORMACIÓN DE PRODUCTOS ===\n");
            contexto.append("Total: ").append(productos.size()).append("\n");
            for (Producto p : productos) {
                contexto.append("Descripcion: ").append(p.getDescripcion())
                        .append("Precio: $").append(p.getPrecio())
                        .append("Stock: ").append(p.getStock())
                        .append("\n");
            }
        }

        // Si pregunta sobre empleados
        if (preguntaLower.contains("empleado") || preguntaLower.contains("trabajador")) {
            List<cEmpleados> empleados = empleadoRepositorio.findAll();
            contexto.append("=== INFORMACIÓN DE EMPLEADOS ===\n");
            contexto.append("Total: ").append(empleados.size()).append("\n");
            for (cEmpleados e : empleados) {
                contexto.append("{ Nombre:  ").append(e.getNombre())
                        .append(", Correo: ").append(e.getDepartamento())
                        .append(", Num telefono: ").append(e.getSueldo())
                        .append("} \n");
            }
        }

        // Si pregunta sobre materiales
        if (preguntaLower.contains("material")) {
            List<cmateriales> materiales = materialesRepositorio.findAll();
            contexto.append("=== INFORMACIÓN DE MATERIALES ===\n");
            contexto.append("Total: ").append(materiales.size()).append("\n");
            for (cmateriales m : materiales) {
                contexto.append("- ").append(m.getNombreMaterial())
                        .append(" - Precio: $").append(m.getPrecioMaterial())
                        .append(", Cantidad: ").append(m.getCantidadMaterial())
                        .append("\n");
            }
        }

        // Si pregunta sobre stock o inventario
        if (preguntaLower.contains("stock") || preguntaLower.contains("inventario")) {
            contexto.append("=== RESUMEN DE INVENTARIO ===\n");

            long totalPinturas = pinturaRepositorio.count();
            long totalProductos = productoRepositorio.count();
            long totalMateriales = materialesRepositorio.count();

            contexto.append("Pinturas en stock: ").append(totalPinturas).append("\n");
            contexto.append("Productos en stock: ").append(totalProductos).append("\n");
            contexto.append("Materiales en stock: ").append(totalMateriales).append("\n");
        }

        // Si no hay contexto específico, retornar resumen general
        if (contexto.length() == 0) {
            contexto.append("=== RESUMEN GENERAL ===\n");
            contexto.append("Pinturas: ").append(pinturaRepositorio.count()).append("\n");
            contexto.append("Productos: ").append(productoRepositorio.count()).append("\n");
            contexto.append("Empleados: ").append(empleadoRepositorio.count()).append("\n");
            contexto.append("Materiales: ").append(materialesRepositorio.count()).append("\n");
            contexto.append("Usuarios: ").append(usuarioRepositorio.count()).append("\n");
            contexto.append("Eventos: ").append(eventoRepositorio.count()).append("\n");
        }

        return contexto.toString();
    }
}