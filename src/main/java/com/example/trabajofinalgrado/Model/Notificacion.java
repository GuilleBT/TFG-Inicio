package com.example.trabajofinalgrado.Model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Notificacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long usuarioDestinoId; // El ID del usuario que recibe el aviso
    
    private String mensaje; 
    
    private boolean leida = false; // Por defecto no está leída
    
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    
    public Notificacion() {}

    public Notificacion(Long usuarioDestinoId, String mensaje) {
        this.usuarioDestinoId = usuarioDestinoId;
        this.mensaje = mensaje;
    }

    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUsuarioDestinoId() { return usuarioDestinoId; }
    public void setUsuarioDestinoId(Long usuarioDestinoId) { this.usuarioDestinoId = usuarioDestinoId; }
    public String getMensaje() { return mensaje; }
    public void setMensaje(String mensaje) { this.mensaje = mensaje; }
    public boolean isLeida() { return leida; }
    public void setLeida(boolean leida) { this.leida = leida; }
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
}
