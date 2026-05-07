package com.example.trabajofinalgrado.Controller;

import com.example.trabajofinalgrado.Model.Tecnologia;
import com.example.trabajofinalgrado.Model.User;
import com.example.trabajofinalgrado.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/me")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Map<String, Object> userData = new HashMap<>();
        userData.put("id", user.getId());
        userData.put("nombre", user.getNombre());
        userData.put("apellido", user.getApellido());
        userData.put("email", user.getEmail());
        userData.put("username", user.getUsername());
        userData.put("experiencia_breve", user.getExperienciaBreve());
        userData.put("imagen_perfil", user.getImagenPerfil());
        userData.put("tecnologias_domina", user.getTecnologiasDomina().stream()
                .map(t -> Map.of("id", t.getId(), "nombre", t.getNombre(), "iconoUrl", t.getIconoUrl() != null ? t.getIconoUrl() : ""))
                .collect(Collectors.toList()));
        userData.put("tecnologias_aprende", user.getTecnologiasAprende().stream()
                .map(t -> Map.of("id", t.getId(), "nombre", t.getNombre(), "iconoUrl", t.getIconoUrl() != null ? t.getIconoUrl() : ""))
                .collect(Collectors.toList()));

        return ResponseEntity.ok(userData);
    }

    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Map<String, Object> userData = new HashMap<>();
        userData.put("id", user.getId());
        userData.put("nombre", user.getNombre());
        userData.put("apellido", user.getApellido());
        userData.put("username", user.getUsername());
        userData.put("experiencia_breve", user.getExperienciaBreve());
        userData.put("imagen_perfil", user.getImagenPerfil());
        userData.put("tecnologias_domina", user.getTecnologiasDomina().stream()
                .map(t -> Map.of("id", t.getId(), "nombre", t.getNombre(), "iconoUrl", t.getIconoUrl() != null ? t.getIconoUrl() : ""))
                .collect(Collectors.toList()));
        userData.put("tecnologias_aprende", user.getTecnologiasAprende().stream()
                .map(t -> Map.of("id", t.getId(), "nombre", t.getNombre(), "iconoUrl", t.getIconoUrl() != null ? t.getIconoUrl() : ""))
                .collect(Collectors.toList()));

        return ResponseEntity.ok(userData);
    }
}
