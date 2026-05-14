package com.example.trabajofinalgrado.Repository;

import com.example.trabajofinalgrado.Model.Notificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificacionRepository extends JpaRepository<Notificacion, Long> {
    // Busca las notificaciones no leídas de un usuario concreto
    List<Notificacion> findByUsuarioDestinoIdAndLeidaFalseOrderByFechaCreacionDesc(Long usuarioDestinoId);
}