package com.example.trabajofinalgrado.Security;

import com.example.trabajofinalgrado.Security.JWT.AuthEntryPointJwt;
import com.example.trabajofinalgrado.Security.JWT.AuthTokenFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class WebSecurityConfig {

    @Autowired
    UserDetailsService userDetailsService;

    @Autowired
    private AuthEntryPointJwt unauthorizedHandler;

    @Bean
    public AuthTokenFilter authenticationJwtTokenFilter() {
        return new AuthTokenFilter();
    }


   @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        
        // Se inyecta usando el setter, esta es la forma correcta
        authProvider.setUserDetailsService(userDetailsService);
        
        // Se configura el encriptador de contraseñas
        authProvider.setPasswordEncoder(passwordEncoder());
        
        return authProvider;
    }


    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

  @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
            // ... (tu configuración de CORS o excepciones si la tienes)
            .authorizeHttpRequests(auth -> auth
                // Permitimos acceso público a auth (login/register)
                .requestMatchers("/api/auth/**").permitAll()
                // Permitimos acceso público a leer las tecnologías
                .requestMatchers("/api/tecnologias/**").permitAll()
                // Cualquier otra petición requiere estar logueado
                .anyRequest().authenticated()
            );
        
        // ... (el resto de tu código con el filtro JWT)
        
        return http.build();
    }
    
}
