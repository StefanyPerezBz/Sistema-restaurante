package com.restaurante.restaurante.service;

import com.restaurante.restaurante.model.Event;
import com.restaurante.restaurante.repository.ManageEventsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class ManageEventsService {
    @Autowired
    private ManageEventsRepository manageEventsRepository;

    public List<Event> getAllEvents() {
        return manageEventsRepository.findAll();
    }

    @Transactional
    public String deleteEventByEventID(String eventID) {
        manageEventsRepository.deleteByEventID(eventID);
        return eventID;
    }

    public Event getEventById(String eventID) {
        return manageEventsRepository.findEventByEventID(eventID).orElse(null);
    }

    public String updateEventByEventID(String eventID, Event event) {
        Event existingEvent = manageEventsRepository.findEventByEventID(eventID).orElse(null);
        if (existingEvent == null) {
            throw new IllegalArgumentException("Evento con identificación " + eventID + " no existe");
        }
        existingEvent.setEventDate(event.getEventDate());
        existingEvent.setEventName(event.getEventName());
        existingEvent.setStartTime(event.getStartTime());
        existingEvent.setDuration(event.getDuration());
        existingEvent.setBudget(event.getBudget());
        existingEvent.setTicketPrice(event.getTicketPrice());
        existingEvent.setEntertainer(event.getEntertainer());
        existingEvent.setSoldTicketQuantity(event.getSoldTicketQuantity());
        existingEvent.setDescription(event.getDescription());
        existingEvent.setEventStatus(event.getEventStatus());
        manageEventsRepository.save(existingEvent);
        return eventID;
    }

    // Encuentre los ingresos totales de los eventos para el mes actual
    @Transactional
    public double getTotalRevenueForCurrentMonth() {
        Double totalRevenue = manageEventsRepository.findTotalRevenueForCurrentMonth();
        return totalRevenue != null ? totalRevenue : 0.0;
    }

    // Encuentre los ingresos totales de los eventos para el año actual
    @Transactional
    public double getTotalRevenueForCurrentYear() {
        Double totalRevenue = manageEventsRepository.findTotalRevenueForCurrentYear();
        return totalRevenue != null ? totalRevenue : 0.0;
    }

    // Encuentre el presupuesto total de eventos para el mes actual
    public double getTotalEventBudgetForCurrentMonth() {
        return manageEventsRepository.findTotalEventBudgetForCurrentMonth();
    }

    // Encuentre la recaudacion total de eventos para el año actual
    public double getTotalEventBudgetForCurrentYear() {
        Double totalBudget = manageEventsRepository.findTotalEventBudgetForCurrentYear();
        return totalBudget != null ? totalBudget : 0.0;
    }

    // Encuentra el próximo evento después de la fecha actual
    public Event getNextEvent() {
        LocalDate currentDate = LocalDate.now();
        return manageEventsRepository.findFirstByEventDateAfterOrderByEventDateAsc(currentDate).orElse(null);
    }

    //
    public Event addEvent(Event event) {
        // Generar ID único para el evento
        String eventID = generateEventID();
        event.setEventID(eventID);

        return manageEventsRepository.save(event);
    }

    public boolean eventNameExists(String eventName) {
        return manageEventsRepository.existsByEventName(eventName);
    }

    public boolean eventExistsOnDate(LocalDate date) {
        return manageEventsRepository.existsByEventDate(date);
    }

    private String generateEventID() {
        // Lógica para generar un ID único
        return "event" + System.currentTimeMillis();
    }
}
