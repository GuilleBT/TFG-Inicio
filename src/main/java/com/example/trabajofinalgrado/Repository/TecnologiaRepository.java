package com.example.trabajofinalgrado.Repository;

import com.example.trabajofinalgrado.Model.Tecnologia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TecnologiaRepository extends JpaRepository<Tecnologia, Long> {
}
