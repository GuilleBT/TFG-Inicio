package com.example.trabajofinalgrado.DTOs.Response;

import com.example.trabajofinalgrado.Model.User;
import lombok.Data;

@Data // Si usas Lombok, si no, genera los Getters y Setters
public class UserSummaryDTO {
    private Long id;
    private String username;
    private String nombre;
    private String apellido;
    private String imagenPerfil;
    private Integer sesionesCompletadas; // <--- PASO 1: AÑADIR ESTO

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
        return dto;
    }
}