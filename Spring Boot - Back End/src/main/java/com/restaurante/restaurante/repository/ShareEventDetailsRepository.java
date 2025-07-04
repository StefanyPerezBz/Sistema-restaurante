package com.restaurante.restaurante.repository;

import com.restaurante.restaurante.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShareEventDetailsRepository extends JpaRepository<Event, String>{
    Event findByEventID(String eventID);
}
