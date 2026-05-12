package com.example.trabajofinalgrado.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = "username"),
        @UniqueConstraint(columnNames = "email")
})
@Getter @Setter
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String email;

    @JsonIgnore
    private String password;
    
    private String nombre;
    private String apellido;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();

    // RELACIÓN CORREGIDA: Tecnologías que domina (EAGER y nombres exactos de la BD)
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_domina",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "tecnologias_domina_id")
    )
    private Set<Tecnologia> tecnologiasDomina = new HashSet<>();

    // RELACIÓN CORREGIDA: Tecnologías que quiere aprender (EAGER y nombres exactos de la BD)
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_aprende",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "tecnologias_aprende_id")
    )
    private Set<Tecnologia> tecnologiasAprende = new HashSet<>();

    @Column(length = 100)
    private String experienciaBreve;

    @Column(columnDefinition = "LONGTEXT")
    private String imagenPerfil;
    
    @Column(length = 500)
    private String bio;

    private String ubicacion;

    private String github;

    private String linkedin;

    @Column(name = "sesiones_completadas")
    private Integer sesionesCompletadas = 0;

}