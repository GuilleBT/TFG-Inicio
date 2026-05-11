package com.example.trabajofinalgrado.DTOs.Request;

import java.util.List;

public class UpdateProfileRequest {
    
    private String nombre;
    private String apellido;
    private String email;
    private String password;
    private String experienciaBreve;
    private String bio;
    private String ubicacion;
    private String github;
    private String linkedin;
    private List<Long> habilidadesIds; // IDs de las tecnologías que domina
    private List<Long> interesesIds;   // IDs de las tecnologías que quiere aprender


    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getApellido() { return apellido; }
    public void setApellido(String apellido) { this.apellido = apellido; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getExperienciaBreve() { return experienciaBreve; }
    public void setExperienciaBreve(String experienciaBreve) { this.experienciaBreve = experienciaBreve; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getUbicacion() { return ubicacion; }
    public void setUbicacion(String ubicacion) { this.ubicacion = ubicacion; }

    public String getGithub() { return github; }
    public void setGithub(String github) { this.github = github; }

    public String getLinkedin() { return linkedin; }
    public void setLinkedin(String linkedin) { this.linkedin = linkedin; }

    public List<Long> getHabilidadesIds() { return habilidadesIds; }
    public void setHabilidadesIds(List<Long> habilidadesIds) { this.habilidadesIds = habilidadesIds; }

    public List<Long> getInteresesIds() { return interesesIds; }
    public void setInteresesIds(List<Long> interesesIds) { this.interesesIds = interesesIds; }
}
