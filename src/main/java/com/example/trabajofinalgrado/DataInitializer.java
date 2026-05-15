package com.example.trabajofinalgrado;

import com.example.trabajofinalgrado.Model.User;
import com.example.trabajofinalgrado.Repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner crearAdminInicial(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.findByUsername("admin").isEmpty()) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setEmail("admin@skillswap.com");
                admin.setPassword(passwordEncoder.encode("12345678"));
                admin.setNombre("Admin");
                admin.setApellido("SkillSwap");
                admin.setRol("ADMIN");
                admin.setBio("Cuenta de administración del sistema.");
                userRepository.save(admin);
                System.out.println(">>> Cuenta admin creada: admin / 12345678");
            }
        };
    }
}