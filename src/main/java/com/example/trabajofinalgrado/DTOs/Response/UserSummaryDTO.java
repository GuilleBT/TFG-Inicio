package com.example.trabajofinalgrado.DTOs.Response;

import java.time.LocalDateTime;

import com.example.trabajofinalgrado.Model.User;
import lombok.Data;

@Data 
public class UserSummaryDTO {
    private Long id;
    private String username;
    private String nombre;
    private String apellido;
    private String imagenPerfil;
    private Integer sesionesCompletadas;
    private String rol;
    private LocalDateTime baneadoHasta;
    private String motivoBaneo;

    public static UserSummaryDTO from(User user) {
        UserSummaryDTO dto = new UserSummaryDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setNombre(user.getNombre());
        dto.setApellido(user.getApellido());
        dto.setImagenPerfil(user.getImagenPerfil());
        
        // PASO 2: MAPEAR EL DATO REAL DE LA ENTIDAD
        // Asegúrate de que en tu clase User.java el campo se llame igual
        dto.setSesionesCompletadas(user.getSesionesCompletadas()); // <--- ¡ESTA LÍNEA ES CLAVE!
        dto.setRol(user.getRol());
        dto.setBaneadoHasta(user.getBaneadoHasta());
        dto.setMotivoBaneo(user.getMotivoBaneo());
        return dto;
    }
}