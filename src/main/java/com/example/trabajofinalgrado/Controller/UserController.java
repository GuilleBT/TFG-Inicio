package com.example.trabajofinalgrado.Controller;

import com.example.trabajofinalgrado.DTOs.Request.UpdateProfileRequest;
import com.example.trabajofinalgrado.Model.Tecnologia;
import com.example.trabajofinalgrado.Model.User;
import com.example.trabajofinalgrado.Repository.TecnologiaRepository;
import com.example.trabajofinalgrado.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // Inyectamos el repositorio de tecnologías para poder buscarlas por ID
    @Autowired
    private TecnologiaRepository tecnologiaRepository;

    // Inyectamos el encriptador para la contraseña
    @Autowired
    private PasswordEncoder encoder;

    @GetMapping("/me")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return ResponseEntity.ok(toMap(user, true));
    }
// ==========================================
    // NUEVO MÉTODO PARA LISTAR TODOS LOS USUARIOS
    // ==========================================
    @GetMapping("/all")
    @Transactional(readOnly = true)
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        // Buscamos todos los usuarios y los convertimos al formato seguro (sin contraseñas)
        List<Map<String, Object>> results = userRepository.findAll().stream()
                .map(u -> toMap(u, false))
                .collect(Collectors.toList());
        return ResponseEntity.ok(results);
    }
    // ==========================================
    // NUEVO MÉTODO PARA ACTUALIZAR EL PERFIL
    // ==========================================
    @PutMapping("/me")
    @Transactional
    public ResponseEntity<?> updateMyProfile(@RequestBody UpdateProfileRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // 1. Actualizamos los campos de texto si no vienen nulos
        if (request.getNombre() != null) user.setNombre(request.getNombre());
        if (request.getApellido() != null) user.setApellido(request.getApellido());
        if (request.getEmail() != null) user.setEmail(request.getEmail());
        if (request.getExperienciaBreve() != null) user.setExperienciaBreve(request.getExperienciaBreve());
        if (request.getBio() != null) user.setBio(request.getBio());
        if (request.getUbicacion() != null) user.setUbicacion(request.getUbicacion());
        if (request.getGithub() != null) user.setGithub(request.getGithub());
        if (request.getLinkedin() != null) user.setLinkedin(request.getLinkedin());

        // 2. Seguridad: Encriptar la contraseña solo si el usuario ha escrito una nueva
        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            user.setPassword(encoder.encode(request.getPassword()));
        }

        // 3. Actualizar tecnologías que domina (habilidades)
        if (request.getHabilidadesIds() != null) {
            List<Tecnologia> habilidades = tecnologiaRepository.findAllById(request.getHabilidadesIds());
            user.setTecnologiasDomina(new HashSet<>(habilidades));
        }

        // 4. Actualizar tecnologías que quiere aprender (intereses)
        if (request.getInteresesIds() != null) {
            List<Tecnologia> intereses = tecnologiaRepository.findAllById(request.getInteresesIds());
            user.setTecnologiasAprende(new HashSet<>(intereses));
        }

        // 5. Guardamos en BD y devolvemos el usuario actualizado
        userRepository.save(user);
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
                .filter(u -> 
                        // Buscamos en nombre, apellido o username (con comprobación de nulos para que no pete)
                        (u.getNombre() != null && u.getNombre().toLowerCase().contains(query)) ||
                        (u.getApellido() != null && u.getApellido().toLowerCase().contains(query)) ||
                        (u.getUsername() != null && u.getUsername().toLowerCase().contains(query)) ||
                        (u.getUbicacion() != null && u.getUbicacion().toLowerCase().contains(query)) ||
                        
                        // ¡MAGIA! Buscamos también dentro de las tecnologías que domina
                        (u.getTecnologiasDomina() != null && u.getTecnologiasDomina().stream()
                                .anyMatch(tech -> tech.getNombre() != null && tech.getNombre().toLowerCase().contains(query)))
                )
                .limit(10) // Limitamos a 10 para no saturar la pantalla
                .map(u -> toMap(u, false))
                .collect(Collectors.toList());
                
        return ResponseEntity.ok(results);
    }

    // He añadido los campos extra (bio, ubicacion, etc) para que Angular los reciba correctamente
    private Map<String, Object> toMap(User user, boolean includeEmail) {
        Map<String, Object> data = new HashMap<>();
        data.put("id", user.getId());
        data.put("nombre", user.getNombre());
        data.put("apellido", user.getApellido());
        data.put("username", user.getUsername());
        data.put("experiencia_breve", user.getExperienciaBreve());
        data.put("bio", user.getBio());
        data.put("ubicacion", user.getUbicacion());
        data.put("github", user.getGithub());
        data.put("linkedin", user.getLinkedin());
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