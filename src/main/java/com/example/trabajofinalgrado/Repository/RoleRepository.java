package com.example.trabajofinalgrado.Repository;

import com.example.trabajofinalgrado.Model.ERole;
import com.example.trabajofinalgrado.Model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {
    Optional<Role> findByName(ERole name);
}