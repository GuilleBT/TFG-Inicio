package com.example.trabajofinalgrado.Security.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Service
public class QuizService {

    // Leemos la URL configurada en application.properties
    @Value("${quizapi.url}")
    private String apiUrl;

    // Leemos tu API Key secreta configurada en application.properties
    @Value("${quizapi.token}")
    private String apiToken;

    private final RestTemplate restTemplate;

    // Inyectamos el RestTemplate que creamos en tu nueva carpeta 'config'
    public QuizService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

public String getRandomQuiz() {
        try {
            // Construimos la URL enviando la llave como api_key (con guion bajo)
            String url = apiUrl + "?api_key=" + apiToken + "&limit=1";
            
            // Hacemos la petición directa (ya no necesitamos empaquetar Headers)
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

            // Devolvemos el JSON puro
            return response.getBody();

        } catch (RestClientException e) {
            System.err.println("Error al conectar con QuizAPI: " + e.getMessage());
            return "[{\"question\": \"Ocurrió un error al cargar el reto. ¿Qué tal si descansas 5 minutos?\", \"answers\": {}}]";
        }
    }
}