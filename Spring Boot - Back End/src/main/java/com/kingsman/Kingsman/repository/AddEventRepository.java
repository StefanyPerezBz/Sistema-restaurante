package com.kingsman.Kingsman.repository;

import com.kingsman.Kingsman.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;

public interface AddEventRepository extends JpaRepository<Event, String>{
    Event findByEventName(String eventName);
    Event findByEventDate(LocalDate eventDate);
    Event save(Event event);
}
