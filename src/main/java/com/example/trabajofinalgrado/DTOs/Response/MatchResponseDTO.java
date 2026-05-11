package com.example.trabajofinalgrado.DTOs.Response;

import com.example.trabajofinalgrado.Model.Tecnologia;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class MatchResponseDTO {
    private UserSummaryDTO usuario;
    private int puntuacionMatch;
    private boolean matchPerfecto;
    private List<TecnologiaDTO> habilidadesQueOfrece;
    private List<TecnologiaDTO> habilidadesQueNecesita;
    private List<TecnologiaDTO> todasLasHabilidades;
    private List<TecnologiaDTO> todosLosIntereses;

    @Getter
    @Setter
    public static class TecnologiaDTO {
        private Long id;
        private String nombre;
        private String iconoUrl;

        public static TecnologiaDTO from(Tecnologia t) {
            TecnologiaDTO dto = new TecnologiaDTO();
            dto.setId(t.getId());
            dto.setNombre(t.getNombre());
            dto.setIconoUrl(t.getIconoUrl());
            return dto;
        }
    }
}
