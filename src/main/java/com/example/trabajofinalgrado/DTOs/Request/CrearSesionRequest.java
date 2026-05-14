package com.example.trabajofinalgrado.DTOs.Request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CrearSesionRequest {
    private Long receptorId;
    private Long tecnologiaId;
    private String titulo;
    private String descripcion;
    private String fechaHora;
    private Integer duracionMinutos;
    private String enlaceMeeting;
    private String enlaceGithub;
    private String telefonoContacto;
}
