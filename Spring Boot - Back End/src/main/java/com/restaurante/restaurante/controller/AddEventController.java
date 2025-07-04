package com.restaurante.restaurante.controller;

import com.restaurante.restaurante.model.Event;
import com.restaurante.restaurante.repository.AddEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Time;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api")
public class AddEventController {

    @Autowired
    private AddEventRepository addEventRepository;

    @PostMapping("/add-event")
    public ResponseEntity<?> register(@RequestBody Event event) {
        // Comprueba si ya existe un evento con el mismo nombre
        Event existingEventName = addEventRepository.findByEventName(event.getEventName());
        if (existingEventName != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Ya existe un evento con el mismo nombre");
        }

        // Comprueba si ya existe un evento con el mismo ID
        Optional<Event> existingEventID = addEventRepository.findById(event.getEventID());
        if (existingEventID.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Ya existe un evento con el mismo ID");
        }

        // Comprueba si ya hay un evento el mismo día
        Event existingEventOnSameDay = addEventRepository.findByEventDate(event.getEventDate());
        if (existingEventOnSameDay != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Ya existe un evento el mismo día");
        }

        // Guardar el evento si no hay conflictos
        addEventRepository.save(event);

        return ResponseEntity.ok("Evento agregado exitosamente");
    }

}
