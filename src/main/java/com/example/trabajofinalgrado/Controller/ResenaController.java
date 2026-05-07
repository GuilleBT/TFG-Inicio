package com.example.trabajofinalgrado.Controller;

import com.example.trabajofinalgrado.DTOs.Request.CrearResenaRequest;
import com.example.trabajofinalgrado.DTOs.Response.ResenaResponseDTO;
import com.example.trabajofinalgrado.Model.Resena;
import com.example.trabajofinalgrado.Model.Sesion;
import com.example.trabajofinalgrado.Model.User;
import com.example.trabajofinalgrado.Repository.ResenaRepository;
import com.example.trabajofinalgrado.Repository.SesionRepository;
import com.example.trabajofinalgrado.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
@RestController
@RequestMapping("/api/reviews")
public class ResenaController {

    @Autowired
    private ResenaRepository resenaRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SesionRepository sesionRepository;

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    @GetMapping("/mine")
    public ResponseEntity<List<ResenaResponseDTO>> getMyReviews() {
        User user = getCurrentUser();
        List<ResenaResponseDTO> result = resenaRepository.findByAutorOrderByCreadoEnDesc(user)
                .stream().map(ResenaResponseDTO::from).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ResenaResponseDTO>> getReviewsForUser(@PathVariable Long userId) {
        User receptor = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        List<ResenaResponseDTO> result = resenaRepository.findByReceptorOrderByCreadoEnDesc(receptor)
                .stream().map(ResenaResponseDTO::from).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<ResenaResponseDTO> create(@RequestBody CrearResenaRequest request) {
        User autor = getCurrentUser();

        User receptor = userRepository.findById(request.getReceptorId())
                .orElseThrow(() -> new RuntimeException("Receptor no encontrado"));

        Resena resena = new Resena();
        resena.setAutor(autor);
        resena.setReceptor(receptor);
        resena.setPuntuacion(request.getPuntuacion());
        resena.setComentario(request.getComentario());

        if (request.getSesionId() != null) {
            Sesion sesion = sesionRepository.findById(request.getSesionId()).orElse(null);
            resena.setSesion(sesion);
        }

        return ResponseEntity.ok(ResenaResponseDTO.from(resenaRepository.save(resena)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        User user = getCurrentUser();
        Resena resena = resenaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reseña no encontrada"));

        if (!resena.getAutor().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }

        resenaRepository.delete(resena);
        return ResponseEntity.noContent().build();
    }
}
