package com.example.trabajofinalgrado.Controller;

import com.example.trabajofinalgrado.Security.Service.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/juegos")
@CrossOrigin(origins = "http://localhost:4200") // Permite que Angular consuma este endpoint sin error de CORS
public class JuegoController {

    private final QuizService quizService;

    // Inyección de dependencias por constructor (Best Practice)
    public JuegoController(QuizService quizService) {
        this.quizService = quizService;
    }

    @GetMapping("/pregunta-diaria")
    public ResponseEntity<String> getPregunta() {
        // Llama al servicio y devuelve el JSON directamente al frontend
        String jsonRespuesta = quizService.getRandomQuiz();
        return ResponseEntity.ok(jsonRespuesta);
    }
}