package com.example.trabajofinalgrado.DTOs.Response;

import com.example.trabajofinalgrado.Model.User;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserSummaryDTO {
    private Long id;
    private String username;
    private String nombre;
    private String apellido;
    private String email;
    private String experienciaBreve;
    private String imagenPerfil;

    public static UserSummaryDTO from(User user) {
        UserSummaryDTO dto = new UserSummaryDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setNombre(user.getNombre());
        dto.setApellido(user.getApellido());
        dto.setEmail(user.getEmail());
        dto.setExperienciaBreve(user.getExperienciaBreve());
        dto.setImagenPerfil(user.getImagenPerfil());
        return dto;
    }
}
