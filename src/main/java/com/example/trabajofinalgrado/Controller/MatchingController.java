package com.example.trabajofinalgrado.Controller;

import com.example.trabajofinalgrado.DTOs.Response.MatchResponseDTO;
import com.example.trabajofinalgrado.DTOs.Response.UserSummaryDTO;
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

        // 1. Comprobamos si el que entra es un INVITADO (sin sesión)
        boolean isGuest = (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal()));

        if (isGuest) {
            // MODO ESCAPARATE: Devolvemos a todos los usuarios sin calcular el "match"
            List<MatchResponseDTO> allUsers = userRepository.findAll().stream()
                    .map(this::buildGuestMatchDTO)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(allUsers);
        }

        // 2. MODO USUARIO REGISTRADO: Tu lógica de matching inteligente original
        User currentUser = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Set<Long> misDominaIds = currentUser.getTecnologiasDomina()
                .stream().map(Tecnologia::getId).collect(Collectors.toSet());
        Set<Long> misAprendeIds = currentUser.getTecnologiasAprende()
                .stream().map(Tecnologia::getId).collect(Collectors.toSet());

        List<MatchResponseDTO> matches = userRepository.findAll().stream()
                .filter(u -> !u.getId().equals(currentUser.getId()))
                .map(u -> buildMatchDTO(u, misDominaIds, misAprendeIds))
                .sorted((a, b) -> b.getPuntuacionMatch() - a.getPuntuacionMatch())
                .collect(Collectors.toList());

        return ResponseEntity.ok(matches);
    }

    private MatchResponseDTO buildMatchDTO(User otro, Set<Long> misDominaIds, Set<Long> misAprendeIds) {
        List<MatchResponseDTO.TecnologiaDTO> queOfrece = otro.getTecnologiasDomina().stream()
                .filter(t -> misAprendeIds.contains(t.getId()))
                .map(MatchResponseDTO.TecnologiaDTO::from)
                .collect(Collectors.toList());

        List<MatchResponseDTO.TecnologiaDTO> queNecesita = otro.getTecnologiasAprende().stream()
                .filter(t -> misDominaIds.contains(t.getId()))
                .map(MatchResponseDTO.TecnologiaDTO::from)
                .collect(Collectors.toList());

        List<MatchResponseDTO.TecnologiaDTO> todasSusHabilidades = otro.getTecnologiasDomina().stream()
                .map(MatchResponseDTO.TecnologiaDTO::from)
                .collect(Collectors.toList());

        List<MatchResponseDTO.TecnologiaDTO> todosIntereses = otro.getTecnologiasAprende().stream()
                .map(MatchResponseDTO.TecnologiaDTO::from)
                .collect(Collectors.toList());

        MatchResponseDTO dto = new MatchResponseDTO();
        dto.setUsuario(UserSummaryDTO.from(otro));
        dto.setHabilidadesQueOfrece(queOfrece);
        dto.setHabilidadesQueNecesita(queNecesita);
        dto.setTodasLasHabilidades(todasSusHabilidades);
        dto.setTodosLosIntereses(todosIntereses);
        dto.setPuntuacionMatch(queOfrece.size() + queNecesita.size());
        dto.setMatchPerfecto(!queOfrece.isEmpty() && !queNecesita.isEmpty());
        return dto;
    }
}
