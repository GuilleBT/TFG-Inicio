package com.example.trabajofinalgrado.DTOs.Response;

import com.example.trabajofinalgrado.Model.Sesion;
import lombok.Getter;
import lombok.Setter;

import java.time.format.DateTimeFormatter;

@Getter
@Setter
public class SesionResponseDTO {

    private static final DateTimeFormatter FMT = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    private Long id;
    private Long solicitanteId;
    private String solicitanteNombre;
    private Long receptorId;
    private String receptorNombre;
    private TecnologiaInfo tecnologia;
    private String titulo;
    private String descripcion;
    private String fechaHora;
    private Integer duracionMinutos;
    private String enlaceMeeting;
    private String enlaceGithub;
    private String estado;
    private String notas;
    private String creadoEn;
    private String telefonoContacto; // <- Aquí está declarado

    @Getter
    @Setter
    public static class TecnologiaInfo {
        private Long id;
        private String nombre;
    }

    public static SesionResponseDTO from(Sesion s) {
        SesionResponseDTO dto = new SesionResponseDTO();
        dto.setId(s.getId());
        dto.setSolicitanteId(s.getSolicitante().getId());
        dto.setSolicitanteNombre(s.getSolicitante().getNombre() + " " + s.getSolicitante().getApellido());
        dto.setReceptorId(s.getReceptor().getId());
        dto.setReceptorNombre(s.getReceptor().getNombre() + " " + s.getReceptor().getApellido());

        if (s.getTecnologia() != null) {
            TecnologiaInfo ti = new TecnologiaInfo();
            ti.setId(s.getTecnologia().getId());
            ti.setNombre(s.getTecnologia().getNombre());
            dto.setTecnologia(ti);
        }

        dto.setTitulo(s.getTitulo());
        dto.setDescripcion(s.getDescripcion());
        dto.setFechaHora(s.getFechaHora() != null ? s.getFechaHora().format(FMT) : null);
        dto.setDuracionMinutos(s.getDuracionMinutos());
        dto.setEnlaceMeeting(s.getEnlaceMeeting());
        dto.setEnlaceGithub(s.getEnlaceGithub());
        dto.setEstado(s.getEstado().name());
        dto.setNotas(s.getNotas());
        dto.setCreadoEn(s.getCreadoEn() != null ? s.getCreadoEn().format(FMT) : null);

        dto.setTelefonoContacto(s.getTelefonoContacto());

        return dto;
    }
}