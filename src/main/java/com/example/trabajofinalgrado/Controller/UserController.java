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
import java.util.List;
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
        return ResponseEntity.ok(toMap(user, true));
    }

    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return ResponseEntity.ok(toMap(user, false));
    }

    @GetMapping("/search")
    @Transactional(readOnly = true)
    public ResponseEntity<List<Map<String, Object>>> searchUsers(@RequestParam String q) {
        String query = q.toLowerCase().trim();
        List<Map<String, Object>> results = userRepository.findAll().stream()
                .filter(u -> u.getNombre().toLowerCase().contains(query)
                        || u.getApellido().toLowerCase().contains(query)
                        || u.getUsername().toLowerCase().contains(query)
                        || u.getEmail().toLowerCase().contains(query))
                .limit(10)
                .map(u -> toMap(u, false))
                .collect(Collectors.toList());
        return ResponseEntity.ok(results);
    }

    private Map<String, Object> toMap(User user, boolean includeEmail) {
        Map<String, Object> data = new HashMap<>();
        data.put("id", user.getId());
        data.put("nombre", user.getNombre());
        data.put("apellido", user.getApellido());
        data.put("username", user.getUsername());
        data.put("experiencia_breve", user.getExperienciaBreve());
        data.put("imagen_perfil", user.getImagenPerfil());
        data.put("tecnologias_domina", user.getTecnologiasDomina().stream()
                .map(t -> Map.of("id", t.getId(), "nombre", t.getNombre(),
                        "iconoUrl", t.getIconoUrl() != null ? t.getIconoUrl() : ""))
                .collect(Collectors.toList()));
        data.put("tecnologias_aprende", user.getTecnologiasAprende().stream()
                .map(t -> Map.of("id", t.getId(), "nombre", t.getNombre(),
                        "iconoUrl", t.getIconoUrl() != null ? t.getIconoUrl() : ""))
                .collect(Collectors.toList()));
        if (includeEmail) data.put("email", user.getEmail());
        return data;
    }
}
