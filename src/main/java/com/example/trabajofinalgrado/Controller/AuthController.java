package com.example.trabajofinalgrado.Controller;

import com.example.trabajofinalgrado.Model.ERole;
import com.example.trabajofinalgrado.Model.Role;
import com.example.trabajofinalgrado.Model.User;
import com.example.trabajofinalgrado.Model.Tecnologia;
import com.example.trabajofinalgrado.Model.UsuarioTecnologia;
import com.example.trabajofinalgrado.Repository.RoleRepository;
import com.example.trabajofinalgrado.Repository.UserRepository;
import com.example.trabajofinalgrado.Repository.TecnologiaRepository;
import com.example.trabajofinalgrado.DTOs.Request.LoginRequest;
import com.example.trabajofinalgrado.DTOs.Request.SignupRequest;
import com.example.trabajofinalgrado.DTOs.Request.TecnologiaDetalleRequest;
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

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Error inesperado: Usuario no encontrado tras autenticar"));

        if (user.getBaneadoHasta() != null && user.getBaneadoHasta().isAfter(java.time.LocalDateTime.now())) {
            return ResponseEntity
                    .status(org.springframework.http.HttpStatus.FORBIDDEN)
                    .body(Map.of(
                        "message", "Tu cuenta está suspendida",
                        "motivo", user.getMotivoBaneo() != null ? user.getMotivoBaneo() : "Incumplimiento de normas",
                        "hasta", user.getBaneadoHasta().toString()
                    ));
        }

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(
                jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles,
                user.getRol()
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest().body("Error: Username is already taken!");
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        User user = new User();
        user.setUsername(signUpRequest.getUsername());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));
        user.setNombre(signUpRequest.getNombre());
        user.setApellido(signUpRequest.getApellido());
        user.setExperienciaBreve(signUpRequest.getExperienciaBreve());
        user.setImagenPerfil(signUpRequest.getImagenPerfil());

        Set<Role> roles = new HashSet<>();
        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        roles.add(userRole);
        user.setRoles(roles);

        if (signUpRequest.getTecnologiasDomina() != null) {
            for (TecnologiaDetalleRequest techRequest : signUpRequest.getTecnologiasDomina()) {
                Tecnologia tecnologia = tecnologiaRepository.findById(techRequest.getTecnologiaId())
                        .orElseThrow(() -> new RuntimeException("Error: Tecnología no encontrada."));
                user.getTecnologiasDomina().add(tecnologia);
            }
        }

        if (signUpRequest.getTecnologiasAprendeIds() != null && !signUpRequest.getTecnologiasAprendeIds().isEmpty()) {
            List<Tecnologia> aprendeList = tecnologiaRepository.findAllById(signUpRequest.getTecnologiasAprendeIds());
            user.setTecnologiasAprende(new HashSet<>(aprendeList));
        }

        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "User registered successfully!"));
    }
}