package com.Oni3D.servicio;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class OllamaService {

    private final ChatClient chatClient;

    @Autowired
    private DataContextService dataContextService;

    @Autowired
    private IntentAnalyzerService intentAnalyzerService;

    public OllamaService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    /**
     * Chat simple sin contexto de base de datos
     */
    public String chat(String mensaje) {
        return chatClient.prompt()
                .user(mensaje)
                .call()
                .content();
    }

    /**
     * Chat con contexto inteligente de la base de datos
     */
    public String chatConBaseDeDatos(String pregunta) {
        String contexto = dataContextService.generarContextoInteligente(pregunta);
        String prompt = construirPrompt(contexto, pregunta);

        return chatClient.prompt()
                .user(prompt)
                .call()
                .content();
    }

    /**
     * Chat con capacidades CRUD
     */
    public Map<String, Object> chatConAccionesCRUD(String mensajeUsuario) {
        if (esAccionCRUD(mensajeUsuario)) {
            return intentAnalyzerService.analizarYEjecutar(mensajeUsuario);
        } else {
            String respuesta = chatConBaseDeDatos(mensajeUsuario);
            return Map.of(
                    "tipo", "consulta",
                    "mensaje", respuesta
            );
        }
    }

    /**
     * Determina si el mensaje es una acción CRUD
     */
    private boolean esAccionCRUD(String mensaje) {
        String mensajeLower = mensaje.toLowerCase().trim();

        System.out.println("DEBUG - Analizando mensaje: '" + mensajeLower + "'");

        boolean esCrear = mensajeLower.startsWith("crea ") ||
                mensajeLower.startsWith("crear ") ||
                mensajeLower.startsWith("agrega ") ||
                mensajeLower.startsWith("agregar ") ||
                mensajeLower.startsWith("añade ") ||
                mensajeLower.startsWith("añadir ") ||
                mensajeLower.startsWith("registra ") ||
                mensajeLower.startsWith("registrar ") ||
                mensajeLower.startsWith("nueva ") ||
                mensajeLower.startsWith("nuevo ") ||
                mensajeLower.contains(" crea una ") ||
                mensajeLower.contains(" agrega un ") ||
                mensajeLower.contains(" añade un ");

        boolean esActualizar = mensajeLower.startsWith("actualiza ") ||
                mensajeLower.startsWith("actualizar ") ||
                mensajeLower.startsWith("modifica ") ||
                mensajeLower.startsWith("modificar ") ||
                mensajeLower.startsWith("cambia ") ||
                mensajeLower.startsWith("cambiar ") ||
                mensajeLower.startsWith("edita ") ||
                mensajeLower.startsWith("editar ") ||
                mensajeLower.contains("actualiza el ") ||
                mensajeLower.contains("modifica el ") ||
                mensajeLower.contains("cambia el ");

        boolean esEliminar = mensajeLower.startsWith("elimina ") ||
                mensajeLower.startsWith("eliminar ") ||
                mensajeLower.startsWith("borra ") ||
                mensajeLower.startsWith("borrar ") ||
                mensajeLower.startsWith("quita ") ||
                mensajeLower.startsWith("quitar ") ||
                mensajeLower.startsWith("remueve ") ||
                mensajeLower.startsWith("remover ") ||
                mensajeLower.contains("elimina el ") ||
                mensajeLower.contains("borra el ");

        boolean resultado = esCrear || esActualizar || esEliminar;

        System.out.println("DEBUG - esCrear: " + esCrear);
        System.out.println("DEBUG - esActualizar: " + esActualizar);
        System.out.println("DEBUG - esEliminar: " + esEliminar);
        System.out.println("DEBUG - RESULTADO esAccionCRUD: " + resultado);

        return resultado;
    }

    /**
     * Construye un prompt optimizado para Ollama con contexto de BD
     */
    private String construirPrompt(String contexto, String pregunta) {
        return String.format(
                "Eres un asistente virtual para el sistema de gestión Oni3D. " +
                        "Tu trabajo es responder preguntas basándote ÚNICAMENTE en los datos proporcionados.\n\n" +
                        "DATOS DE LA BASE DE DATOS:\n%s\n\n" +
                        "INSTRUCCIONES:\n" +
                        "- Responde de forma clara y concisa en español\n" +
                        "- Si la pregunta es sobre cantidades, proporciona el número exacto\n" +
                        "- Si preguntan por listados, muestra los datos de forma organizada\n" +
                        "- Si no tienes información suficiente, dilo claramente\n" +
                        "- No inventes datos que no estén en el contexto\n\n" +
                        "PREGUNTA DEL USUARIO: %s\n\n" +
                        "RESPUESTA:",
                contexto, pregunta
        );
    }
}