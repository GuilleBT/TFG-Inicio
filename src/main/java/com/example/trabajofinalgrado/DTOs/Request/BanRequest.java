package com.example.trabajofinalgrado.DTOs.Request;

import lombok.Data;

@Data
public class BanRequest {
    private String motivo;
    private int dias;
    private int horas;
}
