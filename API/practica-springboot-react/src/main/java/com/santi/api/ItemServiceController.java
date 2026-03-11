package com.santi.api;

import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class ItemServiceController {

    @Value("${data.file.path:./data/items.json}")
    private String dataFilePath;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<Item> obtenerTodos() throws IOException {
        File archivo = new File(dataFilePath);
        if (!archivo.exists()) {
            return new ArrayList<>();
        }
        return objectMapper.readValue(archivo, new TypeReference<List<Item>>() {});
    }

    public Item agregar(Item item) throws IOException {
        List<Item> items = obtenerTodos();
        long nuevoId = items.isEmpty() ? 1L : items.stream().mapToLong(Item::getId).max().orElse(0L) + 1L;
        item.setId(nuevoId);
        items.add(item);
        File archivo = new File(dataFilePath);
        archivo.getParentFile().mkdirs();
        objectMapper.writeValue(archivo, items);
        return item;
    }
}
