package com.example.trabajofinalgrado.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
@RestController
@RequestMapping("/api/matching")
public class MatchingController {

    @GetMapping
    public ResponseEntity<List<?>> getMatches() {

        return ResponseEntity.ok(new ArrayList<>());
    }
}