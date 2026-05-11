package com.example.trabajofinalgrado.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
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
    private String password;
    private String nombre;
    private String apellido;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();

    // AQUÍ MANTENEMOS TU LÓGICA DE DEVPAIR
    @ManyToMany
    @JoinTable(name = "user_domina")
    private Set<Tecnologia> tecnologiasDomina = new HashSet<>();

    @ManyToMany
    @JoinTable(name = "user_aprende")
    private Set<Tecnologia> tecnologiasAprende = new HashSet<>();
    @Column(length = 100)
    private String experienciaBreve;

    // 2. Nueva imagen de perfil en Base64
    @Column(columnDefinition = "LONGTEXT")
    private String imagenPerfil;
    
     @Column(length = 500)
    private String bio;

    private String ubicacion;

    private String github;

    private String linkedin;

    // 3. LA NUEVA RELACIÓN (Borra tu antiguo @ManyToMany de tecnologias domina)
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UsuarioTecnologia> tecnologiasDominaDetalle = new ArrayList<>();
   
}