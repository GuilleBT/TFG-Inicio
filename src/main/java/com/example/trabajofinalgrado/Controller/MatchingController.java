package com.example.trabajofinalgrado.Controller;

import com.example.trabajofinalgrado.DTOs.Response.MatchResponseDTO;
import com.example.trabajofinalgrado.Model.Tecnologia;
import com.example.trabajofinalgrado.Model.User;
import com.example.trabajofinalgrado.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
@RestController
@RequestMapping("/api/matching")
public class MatchingController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<List<MatchResponseDTO>> getMatches() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Set<Long> misDominaIds = currentUser.getTecnologiasDomina()
                .stream().map(Tecnologia::getId).collect(Collectors.toSet());
        Set<Long> misAprendeIds = currentUser.getTecnologiasAprende()
                .stream().map(Tecnologia::getId).collect(Collectors.toSet());

        List<MatchResponseDTO> matches = userRepository.findAll().stream()
                .filter(u -> !u.getId().equals(currentUser.getId()))
                .filter(u -> {
                    Set<Long> susDominaIds = u.getTecnologiasDomina()
                            .stream().map(Tecnologia::getId).collect(Collectors.toSet());
                    Set<Long> susAprendeIds = u.getTecnologiasAprende()
                            .stream().map(Tecnologia::getId).collect(Collectors.toSet());

                    boolean yoPuedoEnsenarle = misDominaIds.stream().anyMatch(susAprendeIds::contains);
                    boolean elPuedoEnsenarme = susDominaIds.stream().anyMatch(misAprendeIds::contains);

                    return yoPuedoEnsenarle && elPuedoEnsenarme;
                })
                .map(u -> buildMatchDTO(u, currentUser, misDominaIds, misAprendeIds))
                .sorted((a, b) -> b.getPuntuacionMatch() - a.getPuntuacionMatch())
                .collect(Collectors.toList());

        return ResponseEntity.ok(matches);
    }

    private MatchResponseDTO buildMatchDTO(User otro, User currentUser,
                                           Set<Long> misDominaIds, Set<Long> misAprendeIds) {
        List<MatchResponseDTO.TecnologiaDTO> queOfrece = otro.getTecnologiasDomina().stream()
                .filter(t -> misAprendeIds.contains(t.getId()))
                .map(MatchResponseDTO.TecnologiaDTO::from)
                .collect(Collectors.toList());

        List<MatchResponseDTO.TecnologiaDTO> queNecesita = otro.getTecnologiasAprende().stream()
                .filter(t -> misDominaIds.contains(t.getId()))
                .map(MatchResponseDTO.TecnologiaDTO::from)
                .collect(Collectors.toList());

        com.example.trabajofinalgrado.DTOs.Response.UserSummaryDTO userSummary =
                com.example.trabajofinalgrado.DTOs.Response.UserSummaryDTO.from(otro);

        MatchResponseDTO dto = new MatchResponseDTO();
        dto.setUsuario(userSummary);
        dto.setHabilidadesQueOfrece(queOfrece);
        dto.setHabilidadesQueNecesita(queNecesita);
        dto.setPuntuacionMatch(queOfrece.size() + queNecesita.size());
        return dto;
    }
}
