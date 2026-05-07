package com.example.trabajofinalgrado.Repository;

import com.example.trabajofinalgrado.Model.Sesion;
import com.example.trabajofinalgrado.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SesionRepository extends JpaRepository<Sesion, Long> {

    @Query("SELECT s FROM Sesion s WHERE s.solicitante = :user OR s.receptor = :user ORDER BY s.creadoEn DESC")
    List<Sesion> findAllByUser(User user);
}
