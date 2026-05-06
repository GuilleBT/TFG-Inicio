package com.example.trabajofinalgrado.DTOs.Request;

public class TecnologiaDetalleRequest {
    private Long tecnologiaId;
    private String nivel;
    private Integer aniosExperiencia;
    private String puntosFuertes;

    // Getters y Setters obligatorios para que Spring Boot sepa meter los datos
    public Long getTecnologiaId() { return tecnologiaId; }
    public void setTecnologiaId(Long tecnologiaId) { this.tecnologiaId = tecnologiaId; }

    public String getNivel() { return nivel; }
    public void setNivel(String nivel) { this.nivel = nivel; }

    public Integer getAniosExperiencia() { return aniosExperiencia; }
    public void setAniosExperiencia(Integer aniosExperiencia) { this.aniosExperiencia = aniosExperiencia; }

    public String getPuntosFuertes() { return puntosFuertes; }
    public void setPuntosFuertes(String puntosFuertes) { this.puntosFuertes = puntosFuertes; }
}