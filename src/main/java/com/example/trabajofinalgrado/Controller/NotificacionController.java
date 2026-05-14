package com.example.trabajofinalgrado.Controller;

import com.example.trabajofinalgrado.Model.Notificacion;
import com.example.trabajofinalgrado.Model.User;
import com.example.trabajofinalgrado.Repository.NotificacionRepository;
import com.example.trabajofinalgrado.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
@RestController
@RequestMapping("/api/notificaciones")
public class NotificacionController {

    @Autowired
    private NotificacionRepository notificacionRepository;
    
    @Autowired
    private UserRepository userRepository;

    // Angular llamará aquí cada 15 segundos
    @GetMapping("/pendientes")
    public ResponseEntity<List<Notificacion>> getPendientes() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        List<Notificacion> pendientes = notificacionRepository
                .findByUsuarioDestinoIdAndLeidaFalseOrderByFechaCreacionDesc(currentUser.getId());
        
        return ResponseEntity.ok(pendientes);
    }

    // Cuando el usuario hace clic en la campana, marcamos como leída
    @PutMapping("/{id}/leer")
    public ResponseEntity<?> marcarComoLeida(@PathVariable Long id) {
        Notificacion notif = notificacionRepository.findById(id).orElseThrow();
        notif.setLeida(true);
        notificacionRepository.save(notif);
        return ResponseEntity.ok().build();
    }
}
