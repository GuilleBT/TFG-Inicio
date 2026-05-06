package com.example.trabajofinalgrado.Controller;

import com.example.trabajofinalgrado.Model.Tecnologia;
import com.example.trabajofinalgrado.Security.Service.TecnologiaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tecnologias")
@CrossOrigin(origins = "http://localhost:4200") 
public class TecnologiaController {
    @Autowired
    private TecnologiaService tecnologiaService;

    @GetMapping
    public List<Tecnologia> obtenerTecnologias() {
        return tecnologiaService.listarTodas();
    }

    @PostMapping
    public Tecnologia crearTecnologia(@RequestBody Tecnologia tecnologia) {
        return tecnologiaService.guardar(tecnologia);
    }
}
