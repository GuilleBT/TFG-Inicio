package com.example.trabajofinalgrado.DTOs.Request;


import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;
import java.util.Set;

@Getter
@Setter
public class SignupRequest {
    @NotBlank
    @Size(min = 3, max = 20)
    private String username;

    @NotBlank
    @Size(max = 50)
    @Email
    private String email;

    @NotBlank
    @Size(min = 6, max = 40)
    private String password;

    private String nombre;
    private String apellido;

    private Set<String> role;

    private List<Long> tecnologiasAprendeIds;

    private String experienciaBreve;
    private String imagenPerfil;

  
    private List<TecnologiaDetalleRequest> tecnologiasDomina;
}