package com.example.trabajofinalgrado.DTOs.Request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CrearResenaRequest {
    private Long receptorId;
    private Long sesionId;
    private Integer puntuacion;
    private String comentario;
}
