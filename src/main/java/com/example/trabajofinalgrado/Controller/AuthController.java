package com.example.trabajofinalgrado.Controller;

import com.example.trabajofinalgrado.Model.ERole;
import com.example.trabajofinalgrado.Model.Role;
import com.example.trabajofinalgrado.Model.User;
import com.example.trabajofinalgrado.Model.Tecnologia;
import com.example.trabajofinalgrado.Model.UsuarioTecnologia; // Entidad nueva
import com.example.trabajofinalgrado.Repository.RoleRepository;
import com.example.trabajofinalgrado.Repository.UserRepository;
import com.example.trabajofinalgrado.Repository.TecnologiaRepository;
import com.example.trabajofinalgrado.DTOs.Request.LoginRequest;
import com.example.trabajofinalgrado.DTOs.Request.SignupRequest;
import com.example.trabajofinalgrado.DTOs.Request.TecnologiaDetalleRequest; // Molde nuevo
import com.example.trabajofinalgrado.DTOs.Response.JwtResponse;
import com.example.trabajofinalgrado.Security.JWT.JwtUtils;
import com.example.trabajofinalgrado.Security.Service.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    TecnologiaRepository tecnologiaRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/signin") // Si en Angular usas /login, recuerda cambiar esto a /login
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt, userDetails.getId(), userDetails.getUsername(), userDetails.getEmail(), roles));
    }

    @PostMapping("/register") // Ajustado a la ruta correcta de Angular
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest().body("Error: Username is already taken!");
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        // 1. Crear la cuenta del usuario
        User user = new User();
        user.setUsername(signUpRequest.getUsername());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));
        user.setNombre(signUpRequest.getNombre());
        user.setApellido(signUpRequest.getApellido());
        
        // --- LOS NUEVOS CAMPOS ---
        user.setExperienciaBreve(signUpRequest.getExperienciaBreve());
        user.setImagenPerfil(signUpRequest.getImagenPerfil());

        // 2. Asignar rol por defecto (ROLE_USER)
        Set<Role> roles = new HashSet<>();
        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        roles.add(userRole);
        user.setRoles(roles);

        // 3. LA NUEVA LÓGICA: Asignar tecnologías que DOMINA con todos sus detalles
        if (signUpRequest.getTecnologiasDomina() != null) {
            for (TecnologiaDetalleRequest techRequest : signUpRequest.getTecnologiasDomina()) {
                
                Tecnologia tecnologia = tecnologiaRepository.findById(techRequest.getTecnologiaId())
                        .orElseThrow(() -> new RuntimeException("Error: Tecnología no encontrada."));

                UsuarioTecnologia usuarioTecnologia = new UsuarioTecnologia();
                usuarioTecnologia.setUsuario(user);
                usuarioTecnologia.setTecnologia(tecnologia);
                usuarioTecnologia.setNivel(techRequest.getNivel());
                usuarioTecnologia.setAniosExperiencia(techRequest.getAniosExperiencia());
                usuarioTecnologia.setPuntosFuertes(techRequest.getPuntosFuertes());

                user.getTecnologiasDominaDetalle().add(usuarioTecnologia);
            }
        }

        // 4. Asignar tecnologías que APRENDE (Esto se queda igual, como una lista simple)
        if (signUpRequest.getTecnologiasAprendeIds() != null && !signUpRequest.getTecnologiasAprendeIds().isEmpty()) {
            List<Tecnologia> aprendeList = tecnologiaRepository.findAllById(signUpRequest.getTecnologiasAprendeIds());
            user.setTecnologiasAprende(new HashSet<>(aprendeList));
        }

        // 5. Guardar el usuario completo en BD
        userRepository.save(user);

        // Devolvemos el mensaje envuelto en un Map para que Angular lo lea como JSON perfecto
        return ResponseEntity.ok(Map.of("message", "User registered successfully!"));
    }
}