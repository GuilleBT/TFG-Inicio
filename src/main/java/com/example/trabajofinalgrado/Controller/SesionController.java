package com.example.trabajofinalgrado.Controller;

import com.example.trabajofinalgrado.DTOs.Request.CrearSesionRequest;
import com.example.trabajofinalgrado.DTOs.Response.SesionResponseDTO;
import com.example.trabajofinalgrado.Model.EstadoSesion;
import com.example.trabajofinalgrado.Model.Sesion;
import com.example.trabajofinalgrado.Model.Tecnologia;
import com.example.trabajofinalgrado.Model.User;
import com.example.trabajofinalgrado.Repository.SesionRepository;
import com.example.trabajofinalgrado.Repository.TecnologiaRepository;
import com.example.trabajofinalgrado.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
@RestController
@RequestMapping("/api/sessions")
public class SesionController {

    @Autowired
    private SesionRepository sesionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TecnologiaRepository tecnologiaRepository;

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    @GetMapping
    public ResponseEntity<List<SesionResponseDTO>> getMySessions() {
        User user = getCurrentUser();
        List<SesionResponseDTO> result = sesionRepository.findAllByUser(user)
                .stream().map(SesionResponseDTO::from).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SesionResponseDTO> getById(@PathVariable Long id) {
        User user = getCurrentUser();
        Sesion sesion = sesionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sesión no encontrada"));

        if (!sesion.getSolicitante().getId().equals(user.getId()) &&
                !sesion.getReceptor().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(SesionResponseDTO.from(sesion));
    }

    @PostMapping
    public ResponseEntity<SesionResponseDTO> create(@RequestBody CrearSesionRequest request) {
        User solicitante = getCurrentUser();

        User receptor = userRepository.findById(request.getReceptorId())
                .orElseThrow(() -> new RuntimeException("Receptor no encontrado"));

        Sesion sesion = new Sesion();
        sesion.setSolicitante(solicitante);
        sesion.setReceptor(receptor);
        sesion.setTitulo(request.getTitulo());
        sesion.setDescripcion(request.getDescripcion());
        sesion.setDuracionMinutos(request.getDuracionMinutos());
        sesion.setEnlaceMeeting(request.getEnlaceMeeting());
        sesion.setEnlaceGithub(request.getEnlaceGithub());
        sesion.setEstado(EstadoSesion.PENDIENTE);

        if (request.getFechaHora() != null && !request.getFechaHora().isBlank()) {
            sesion.setFechaHora(LocalDateTime.parse(request.getFechaHora()));
        }

        if (request.getTecnologiaId() != null) {
            Tecnologia tec = tecnologiaRepository.findById(request.getTecnologiaId())
                    .orElse(null);
            sesion.setTecnologia(tec);
        }

        return ResponseEntity.ok(SesionResponseDTO.from(sesionRepository.save(sesion)));
    }

    @PatchMapping("/{id}/confirm")
    public ResponseEntity<SesionResponseDTO> confirm(@PathVariable Long id) {
        User user = getCurrentUser();
        Sesion sesion = sesionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sesión no encontrada"));

        if (!sesion.getReceptor().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }
        if (sesion.getEstado() != EstadoSesion.PENDIENTE) {
            return ResponseEntity.badRequest().build();
        }

        sesion.setEstado(EstadoSesion.CONFIRMADA);
        return ResponseEntity.ok(SesionResponseDTO.from(sesionRepository.save(sesion)));
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<SesionResponseDTO> complete(@PathVariable Long id) {
        User user = getCurrentUser();
        Sesion sesion = sesionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sesión no encontrada"));

        boolean esParte = sesion.getSolicitante().getId().equals(user.getId()) ||
                sesion.getReceptor().getId().equals(user.getId());
        if (!esParte) return ResponseEntity.status(403).build();

        if (sesion.getEstado() != EstadoSesion.CONFIRMADA) {
            return ResponseEntity.badRequest().build();
        }

        sesion.setEstado(EstadoSesion.COMPLETADA);
        return ResponseEntity.ok(SesionResponseDTO.from(sesionRepository.save(sesion)));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<SesionResponseDTO> cancel(@PathVariable Long id) {
        User user = getCurrentUser();
        Sesion sesion = sesionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sesión no encontrada"));

        boolean esParte = sesion.getSolicitante().getId().equals(user.getId()) ||
                sesion.getReceptor().getId().equals(user.getId());
        if (!esParte) return ResponseEntity.status(403).build();

        if (sesion.getEstado() == EstadoSesion.COMPLETADA || sesion.getEstado() == EstadoSesion.CANCELADA) {
            return ResponseEntity.badRequest().build();
        }

        sesion.setEstado(EstadoSesion.CANCELADA);
        return ResponseEntity.ok(SesionResponseDTO.from(sesionRepository.save(sesion)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        User user = getCurrentUser();
        Sesion sesion = sesionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sesión no encontrada"));

        if (!sesion.getSolicitante().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }

        sesionRepository.delete(sesion);
        return ResponseEntity.noContent().build();
    }
}
