package com.example.trabajofinalgrado.Security.Service;

import com.example.trabajofinalgrado.Model.User;
import com.example.trabajofinalgrado.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        Optional<User> userByEmail = userRepository.findByEmail(identifier);
        if (userByEmail.isPresent()) {
            return UserDetailsImpl.build(userByEmail.get());
        }

        Optional<User> userByUsername = userRepository.findByUsername(identifier);
        if (userByUsername.isPresent()) {
            return UserDetailsImpl.build(userByUsername.get());
        }
        throw new UsernameNotFoundException("Usuario no encontrado con el identificador: " + identifier);
    }
}