package com.example.trabajofinalgrado.Model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "sesiones")
@Getter
@Setter
@NoArgsConstructor
public class Sesion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "solicitante_id", nullable = false)
    private User solicitante;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "receptor_id", nullable = false)
    private User receptor;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "tecnologia_id")
    private Tecnologia tecnologia;

    @Column(nullable = false)
    private String titulo;

    @Column(length = 1000)
    private String descripcion;

    private LocalDateTime fechaHora;

    private Integer duracionMinutos;

    private String enlaceMeeting;

    private String enlaceGithub;

    private String telefonoContacto;
    
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private EstadoSesion estado;

    @Column(length = 1000)
    private String notas;

    private LocalDateTime creadoEn;

    @PrePersist
    protected void onCreate() {
        creadoEn = LocalDateTime.now();
        if (estado == null) estado = EstadoSesion.PENDIENTE;
    }
}
