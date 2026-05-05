package com.example.trabajofinalgrado.Repository;

import com.example.trabajofinalgrado.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Este método es el que busca el UserDetailsServiceImpl
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    // También es útil tener este para validar si el email ya existe en el registro
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
}