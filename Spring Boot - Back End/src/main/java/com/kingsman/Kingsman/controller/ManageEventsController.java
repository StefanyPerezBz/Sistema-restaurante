package com.kingsman.Kingsman.controller;

import com.kingsman.Kingsman.model.Event;
import com.kingsman.Kingsman.repository.ManageEventsRepository;
import com.kingsman.Kingsman.service.ManageEventsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

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


}
