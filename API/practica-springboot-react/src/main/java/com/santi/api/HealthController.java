package com.santi.api;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {
       @GetMapping("/health")
    public String health() {
        return "OK. Les presento el Backend corriendo exitosamente. ROLANDO EL BACKEND.";
    } 
}
