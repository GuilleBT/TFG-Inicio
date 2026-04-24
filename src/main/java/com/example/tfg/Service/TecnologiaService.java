package com.example.tfg.Service;

import com.example.tfg.Model.Tecnologia;
import com.example.tfg.Repository.TecnologiaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TecnologiaService {
    @Autowired
    private TecnologiaRepository tecnologiaRepository;

    public List<Tecnologia> listarTodas() {
        return tecnologiaRepository.findAll();
    }

    public Tecnologia guardar(Tecnologia tecnologia) {
        return tecnologiaRepository.save(tecnologia);
    }
}