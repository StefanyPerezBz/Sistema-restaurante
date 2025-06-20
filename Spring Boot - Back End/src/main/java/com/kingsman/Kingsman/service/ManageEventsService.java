package com.kingsman.Kingsman.service;

import com.kingsman.Kingsman.model.Event;
import com.kingsman.Kingsman.repository.ManageEventsRepository;
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

    // Find Total revenue of events for current month
    @Transactional
    public double getTotalRevenueForCurrentMonth() {
        Double totalRevenue = manageEventsRepository.findTotalRevenueForCurrentMonth();
        return totalRevenue != null ? totalRevenue : 0.0;
    }

    // Find Total revenue of events for current year
    @Transactional
    public double getTotalRevenueForCurrentYear() {
        Double totalRevenue = manageEventsRepository.findTotalRevenueForCurrentYear();
        return totalRevenue != null ? totalRevenue : 0.0;
    }

    // Find Total budget of events for current month
    public double getTotalEventBudgetForCurrentMonth() {
        return manageEventsRepository.findTotalEventBudgetForCurrentMonth();
    }

    // Find Total budget of events for current year
    public double getTotalEventBudgetForCurrentYear() {
        Double totalBudget = manageEventsRepository.findTotalEventBudgetForCurrentYear();
        return totalBudget != null ? totalBudget : 0.0;
    }

    // Find the next event after the current date
    public Event getNextEvent() {
        LocalDate currentDate = LocalDate.now();
        return manageEventsRepository.findFirstByEventDateAfterOrderByEventDateAsc(currentDate).orElse(null);
    }

}
