package com.example.trabajofinalgrado.DTOs.Response;

import com.example.trabajofinalgrado.Model.Resena;
import lombok.Getter;
import lombok.Setter;

import java.time.format.DateTimeFormatter;

@Getter
@Setter
public class ResenaResponseDTO {

    private static final DateTimeFormatter FMT = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    private Long id;
    private Long autorId;
    private String autorNombre;
    private Long receptorId;
    private String receptorNombre;
    private Long sesionId;
    private Integer puntuacion;
    private String comentario;
    private String creadoEn;

    public static ResenaResponseDTO from(Resena r) {
        ResenaResponseDTO dto = new ResenaResponseDTO();
        dto.setId(r.getId());
        dto.setAutorId(r.getAutor().getId());
        dto.setAutorNombre(r.getAutor().getNombre() + " " + r.getAutor().getApellido());
        dto.setReceptorId(r.getReceptor().getId());
        dto.setReceptorNombre(r.getReceptor().getNombre() + " " + r.getReceptor().getApellido());
        dto.setSesionId(r.getSesion() != null ? r.getSesion().getId() : null);
        dto.setPuntuacion(r.getPuntuacion());
        dto.setComentario(r.getComentario());
        dto.setCreadoEn(r.getCreadoEn() != null ? r.getCreadoEn().format(FMT) : null);
        return dto;
    }
}
