package com.example.trabajofinalgrado.Controller;

import com.example.trabajofinalgrado.Model.User;
import com.example.trabajofinalgrado.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName(); 

        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            return ResponseEntity.status(404).body("Usuario no encontrado");
        }

        User user = userOptional.get();

        Map<String, Object> userData = new HashMap<>();
        userData.put("id", user.getId());
        userData.put("nombre", user.getNombre());
        userData.put("apellido", user.getApellido());
        userData.put("email", user.getEmail());
        userData.put("username", user.getUsername());
        userData.put("experiencia_breve", user.getExperienciaBreve());
        userData.put("imagen_perfil", user.getImagenPerfil());
        userData.put("tecnologias_domina", user.getTecnologiasDomina());
        userData.put("tecnologias_aprende", user.getTecnologiasAprende());

        return ResponseEntity.ok(userData);
    }
}