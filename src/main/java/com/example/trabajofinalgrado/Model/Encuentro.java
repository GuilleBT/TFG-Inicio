package com.example.trabajofinalgrado.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "encuentros")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Encuentro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // El usuario que envía la solicitud de encuentro (Match)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "emisor_id", nullable = false)
    private User emisor;

    // El usuario que recibe la solicitud
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "receptor_id", nullable = false)
    private User receptor;

    // Estado de la solicitud (Pendiente, Aceptado, Rechazado)
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private EstadoEncuentro estado;

    // Fecha en la que se hizo el match/solicitud
    private LocalDateTime fechaCreacion;

    // Opcional: Un pequeño mensaje de saludo al conectar
    private String mensaje;


}