package com.Oni3D.servicio;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class IntentAnalyzerService {

    private final ChatClient chatClient;
    private final ObjectMapper objectMapper;

    @Autowired
    private DataBaseActionService databaseActionService;

    public IntentAnalyzerService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
        this.objectMapper = new ObjectMapper();
    }

    public Map<String, Object> analizarYEjecutar(String mensajeUsuario) {
        Map<String, Object> respuesta = new HashMap<>();

        try {
            // Analizar intención
            String intentJson = analizarIntencion(mensajeUsuario);

            System.out.println("DEBUG - Intención analizada: " + intentJson); // DEBUG

            // Parsear JSON
            Map<String, Object> intencion = objectMapper.readValue(
                    intentJson,
                    new TypeReference<Map<String, Object>>() {}
            );

            String accion = (String) intencion.get("accion");

            // Ejecutar solo si NO es consulta
            if (accion != null && !accion.equalsIgnoreCase("CONSULTAR") && !accion.equalsIgnoreCase("LEER")) {

                String entidad = (String) intencion.get("entidad");

                @SuppressWarnings("unchecked")
                Map<String, Object> datos = (Map<String, Object>) intencion.getOrDefault("datos", new HashMap<>());

                System.out.println("DEBUG - Ejecutando acción: " + accion + " en " + entidad); // DEBUG

                // Ejecutar acción en BD
                Map<String, Object> resultado = databaseActionService.ejecutarAccion(accion, entidad, datos);

                // Generar respuesta
                String respuestaNatural = generarRespuestaNatural(resultado, accion, entidad);

                respuesta.put("tipo", "accion");
                respuesta.put("accion", accion);
                respuesta.put("entidad", entidad);
                respuesta.put("resultado", resultado);
                respuesta.put("mensaje", respuestaNatural);

            } else {
                // Es solo consulta
                respuesta.put("tipo", "consulta");
                respuesta.put("mensaje", "Esta es una consulta de lectura, no una acción de modificación");
            }

        } catch (Exception e) {
            e.printStackTrace(); // DEBUG
            respuesta.put("tipo", "error");
            respuesta.put("mensaje", "Error al procesar: " + e.getMessage());
        }

        return respuesta;
    }

    private String analizarIntencion(String mensajeUsuario) {
        String prompt = String.format(
                "Eres un analizador de comandos SQL. Analiza el siguiente mensaje y determina QUÉ HACER.\n\n" +
                        "Mensaje del usuario: \"%s\"\n\n" +
                        "Responde SOLO con un JSON válido (sin markdown ni explicaciones):\n" +
                        "{\n" +
                        "  \"accion\": \"CREAR|ACTUALIZAR|ELIMINAR|CONSULTAR\",\n" +
                        "  \"entidad\": \"PINTURA|PRODUCTO|EMPLEADO|MATERIAL\",\n" +
                        "  \"datos\": {\"campo\": \"valor\"}\n" +
                        "}\n\n" +
                        "EJEMPLOS IMPORTANTES:\n" +
                        "1. \"Crea una pintura roja marca Comex precio 150 stock 10\"\n" +
                        "   {\"accion\":\"CREAR\",\"entidad\":\"PINTURA\",\"datos\":{\"marca\":\"Comex\",\"color\":\"roja\",\"precio\":\"150\",\"stock\":\"10\"}}\n\n" +
                        "2. \"Actualiza el precio de la pintura 5 a 200\"\n" +
                        "   {\"accion\":\"ACTUALIZAR\",\"entidad\":\"PINTURA\",\"datos\":{\"id\":\"5\",\"precio\":\"200\"}}\n\n" +
                        "3. \"Elimina el producto 3\"\n" +
                        "   {\"accion\":\"ELIMINAR\",\"entidad\":\"PRODUCTO\",\"datos\":{\"id\":\"3\"}}\n\n" +
                        "4. \"¿Cuántas pinturas hay?\"\n" +
                        "   {\"accion\":\"CONSULTAR\",\"entidad\":\"PINTURA\",\"datos\":{}}\n\n" +
                        "IMPORTANTE:\n" +
                        "- Si dice 'crea', 'agrega', 'registra', 'añade' → CREAR\n" +
                        "- Si dice 'actualiza', 'modifica', 'cambia' → ACTUALIZAR\n" +
                        "- Si dice 'elimina', 'borra', 'quita' → ELIMINAR\n" +
                        "- Si pregunta '¿cuántos?', 'muestra', 'lista' → CONSULTAR\n\n" +
                        "Responde ÚNICAMENTE el JSON:",
                mensajeUsuario
        );

        String respuesta = chatClient.prompt()
                .user(prompt)
                .call()
                .content();

        // Limpiar respuesta por si viene con markdown
        respuesta = respuesta.trim();
        if (respuesta.startsWith("```json")) {
            respuesta = respuesta.substring(7);
        }
        if (respuesta.startsWith("```")) {
            respuesta = respuesta.substring(3);
        }
        if (respuesta.endsWith("```")) {
            respuesta = respuesta.substring(0, respuesta.length() - 3);
        }

        return respuesta.trim();
    }

    private String generarRespuestaNatural(Map<String, Object> resultado, String accion, String entidad) {
        boolean exito = (boolean) resultado.getOrDefault("exito", false);
        String mensaje = (String) resultado.get("mensaje");

        if (exito) {
            Object id = resultado.get("id");
            switch (accion.toUpperCase()) {
                case "CREAR":
                    return String.format("✅ %s creado/a exitosamente con ID: %s\n%s",
                            entidad, id, mensaje);
                case "ACTUALIZAR":
                    return String.format("✅ %s actualizado/a exitosamente\n%s",
                            entidad, mensaje);
                case "ELIMINAR":
                    return String.format("✅ %s eliminado/a exitosamente\n%s",
                            entidad, mensaje);
                default:
                    return "✅ " + mensaje;
            }
        } else {
            return "❌ " + mensaje;
        }
    }
}