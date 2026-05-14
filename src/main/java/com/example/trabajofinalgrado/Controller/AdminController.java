package com.example.trabajofinalgrado.Controller;

import com.example.trabajofinalgrado.Model.EstadoSesion;
import com.example.trabajofinalgrado.Model.Notificacion;
import com.example.trabajofinalgrado.Model.Sesion;
import com.example.trabajofinalgrado.Model.User;
import com.example.trabajofinalgrado.Repository.NotificacionRepository;
import com.example.trabajofinalgrado.Repository.SesionRepository;
import com.example.trabajofinalgrado.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SesionRepository sesionRepository;

    @Autowired
    private NotificacionRepository notificacionRepository;

    // Un pequeño DTO interno para recibir los datos del baneo desde Angular
    public static class BanRequest {
        public String motivo;
        public int dias;
        public int horas;
    }

    @PostMapping("/ban/{userId}")
    public ResponseEntity<?> banearUsuario(@PathVariable Long userId, @RequestBody BanRequest request) {
        // 1. Comprobamos que el que ejecuta la acción es realmente un ADMIN
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User adminUser = userRepository.findByUsername(auth.getName()).orElseThrow();
        
        if (!"ADMIN".equals(adminUser.getRol())) {
            return ResponseEntity.status(403).body("Acceso denegado: No eres administrador");
        }

        // 2. Buscamos a la víctima
        User targetUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if ("ADMIN".equals(targetUser.getRol())) {
            return ResponseEntity.badRequest().body("No puedes banear a otro administrador.");
        }

        // 3. Aplicamos la condena matemática
        LocalDateTime fechaFinCastigo = LocalDateTime.now()
                .plusDays(request.dias)
                .plusHours(request.horas);

        targetUser.setBaneadoHasta(fechaFinCastigo);
        targetUser.setMotivoBaneo(request.motivo);
        userRepository.save(targetUser);

        // 4. EL EFECTO DOMINÓ: Cancelar todas sus sesiones activas
        List<Sesion> susSesiones = sesionRepository.findAllByUser(targetUser);
        
        for (Sesion s : susSesiones) {
            if (s.getEstado() == EstadoSesion.PENDIENTE || s.getEstado() == EstadoSesion.CONFIRMADA) {
                s.setEstado(EstadoSesion.CANCELADA);
                sesionRepository.save(s);

                // Averiguamos quién es el "inocente" (la otra parte) para mandarle una notificación
                Long idInocente = s.getSolicitante().getId().equals(targetUser.getId()) 
                        ? s.getReceptor().getId() 
                        : s.getSolicitante().getId();
                
                String aviso = "El sistema ha cancelado automáticamente tu sesión con " 
                        + targetUser.getNombre() + " debido a una penalización de su cuenta.";
                notificacionRepository.save(new Notificacion(idInocente, aviso));
            }
        }

        return ResponseEntity.ok("Usuario baneado correctamente y sesiones canceladas.");
    }
}