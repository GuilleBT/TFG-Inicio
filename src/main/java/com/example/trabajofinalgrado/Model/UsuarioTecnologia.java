package com.example.trabajofinalgrado.Model;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "usuario_tecnologia")
public class UsuarioTecnologia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Conectamos con el Usuario
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User usuario;

    // Conectamos con la Tecnología
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tecnologia_id")
    private Tecnologia tecnologia;

    // --- LOS NUEVOS CAMPOS OBLIGATORIOS ---
    private String nivel;
    
    private Integer aniosExperiencia;

    @Column(length = 30)
    private String puntosFuertes;

    // Constructor vacío obligatorio para Spring
    public UsuarioTecnologia() {}

    
}
