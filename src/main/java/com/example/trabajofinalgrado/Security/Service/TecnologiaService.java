package com.example.trabajofinalgrado.Security.Service;

import com.example.trabajofinalgrado.Model.Tecnologia;
import com.example.trabajofinalgrado.Repository.TecnologiaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TecnologiaService {

    @Autowired
    private TecnologiaRepository tecnologiaRepository;

    // 1. Listar todas (Para que tus compañeros rellenen los chips del Front)
    public List<Tecnologia> listarTodas() {
        return tecnologiaRepository.findAll();
    }

    // 2. Guardar/Crear (Para que metas tecnologías nuevas desde Postman)
    public Tecnologia guardar(Tecnologia tecnologia) {
        return tecnologiaRepository.save(tecnologia);
    }

    // 3. NUEVO: Buscar una sola (Útil para validaciones o detalles)
    public Optional<Tecnologia> buscarPorId(Long id) {
        return tecnologiaRepository.findById(id);
    }

    // 4. NUEVO: Buscar varias por ID
    // Este método lo usa internamente el sistema para el registro masivo
    public List<Tecnologia> buscarMuchasPorId(List<Long> ids) {
        return tecnologiaRepository.findAllById(ids);
    }
}