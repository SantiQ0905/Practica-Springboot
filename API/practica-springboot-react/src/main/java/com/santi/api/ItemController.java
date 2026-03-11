package com.santi.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "*")
public class ItemController {

    @Autowired
    private ItemServiceController itemService;

    @GetMapping
    public ResponseEntity<List<Item>> obtenerTodos() {
        try {
            return ResponseEntity.ok(itemService.obtenerTodos());
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping
    public ResponseEntity<Item> agregar(@RequestBody Item item) {
        try {
            return ResponseEntity.ok(itemService.agregar(item));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
