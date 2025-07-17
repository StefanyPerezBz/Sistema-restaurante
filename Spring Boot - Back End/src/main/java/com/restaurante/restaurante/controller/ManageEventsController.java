package com.restaurante.restaurante.controller;

import com.restaurante.restaurante.model.Event;
import com.restaurante.restaurante.repository.ManageEventsRepository;
import com.restaurante.restaurante.service.ManageEventsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/events")
public class ManageEventsController {
    @Autowired
    private ManageEventsService manageEventsService;

    @GetMapping("/view-events")
    public List<Event> getAllEvents() {
        return manageEventsService.getAllEvents();
    }

    @DeleteMapping("/delete/{eventID}")
    public ResponseEntity<?> deleteEventByEventID(@PathVariable String eventID) {
        try {
            // Delegar la lógica de eliminación a la capa de servicio
            manageEventsService.deleteEventByEventID(eventID);
            return new ResponseEntity<>("El evento ha sido eliminado.", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("No se pudo eliminar el evento: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("get/{eventID}")
    public ResponseEntity<?> getEventByEventID(@PathVariable String eventID) {
        try {
            // Delegar la lógica de recuperación a la capa de servicio
            Event event = manageEventsService.getEventById(eventID);
            return new ResponseEntity<>(event, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("No se pudo recuperar el evento: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/update/{eventID}")
    public ResponseEntity<?> updateEventByEventID(@PathVariable String eventID, @RequestBody Event event) {
        try {
            // Delegar la lógica de recuperación a la capa de servicio
//            String updatedEventName = manageEventsService.updateEventByEventID(eventID, event);
            manageEventsService.updateEventByEventID(eventID, event);
            return new ResponseEntity<>("El evento ha sido actualizado.", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("No se pudo actualizar el evento: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/monthly-total-revenue")
    public ResponseEntity<Double> getTotalRevenueForCurrentMonth() {
        try {
            double totalRevenue = manageEventsService.getTotalRevenueForCurrentMonth();
            return new ResponseEntity<>(totalRevenue, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/annual-total-revenue")
    public ResponseEntity<Double> getTotalRevenueForCurrentYear() {
        try {
            double totalRevenue = manageEventsService.getTotalRevenueForCurrentYear();
            return new ResponseEntity<>(totalRevenue, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/monthly-total-budget")
    public ResponseEntity<Double> getTotalEventBudgetForCurrentMonth() {
        try {
            double totalBudget = manageEventsService.getTotalEventBudgetForCurrentMonth();
            return new ResponseEntity<>(totalBudget, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/annual-total-budget")
    public ResponseEntity<Double> getTotalEventBudgetForCurrentYear() {
        try {
            double totalBudget = manageEventsService.getTotalEventBudgetForCurrentYear();
            return new ResponseEntity<>(totalBudget, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Obtener el próximo evento después de la fecha actual
    @GetMapping("/next-event")
    public ResponseEntity<Event> getNextEvent() {
        try {
            Event nextEvent = manageEventsService.getNextEvent();
            return new ResponseEntity<>(nextEvent, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //
    @PostMapping("/add-event")
    public ResponseEntity<?> addEvent(@RequestBody Event event) {
        try {
            // Validar campos obligatorios
            if (event.getEventName() == null || event.getEventName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("El nombre del evento es obligatorio");
            }
            if (event.getEventDate() == null) {
                return ResponseEntity.badRequest().body("La fecha del evento es obligatoria");
            }
            if (event.getStartTime() == null || event.getStartTime().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("La hora de inicio es obligatoria");
            }

            // Verificar duplicados
            if (manageEventsService.eventNameExists(event.getEventName())) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Ya existe un evento con el mismo nombre");
            }
            if (manageEventsService.eventExistsOnDate(event.getEventDate())) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Ya existe un evento el mismo día");
            }

            Event createdEvent = manageEventsService.addEvent(event);
            return new ResponseEntity<>(createdEvent, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al agregar el evento: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/check-name")
    public ResponseEntity<Map<String, Boolean>> checkEventNameExists(@RequestParam String name) {
        boolean exists = manageEventsService.eventNameExists(name);
        return ResponseEntity.ok(Collections.singletonMap("exists", exists));
    }

}
