package com.kingsman.Kingsman.repository;

import com.kingsman.Kingsman.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ManageEventsRepository extends JpaRepository<Event, String> {
    // Buscar evento por ID de evento
    Optional<Event> findEventByEventID(String eventID);

    // eliminar evento por eventID
    void deleteByEventID(String eventID);

    // Encuentra todos los eventos del mes actual
    @Query("SELECT SUM(e.ticketPrice * e.soldTicketQuantity) FROM Event e WHERE MONTH(e.eventDate) = MONTH(CURRENT_DATE) AND YEAR(e.eventDate) = YEAR(CURRENT_DATE)")
    Double findTotalRevenueForCurrentMonth();

    // Encuentre los ingresos totales de los eventos para el año actual
    @Query("SELECT SUM(e.ticketPrice * e.soldTicketQuantity) FROM Event e WHERE YEAR(e.eventDate) = YEAR(CURRENT_DATE)")
    Double findTotalRevenueForCurrentYear();

    //  Encuentre el presupuesto total de eventos para el mes actual
    @Query("SELECT SUM(o.budget) FROM Event o WHERE MONTH(o.eventDate) = MONTH(CURRENT_DATE) AND YEAR(o.eventDate) = YEAR(CURRENT_DATE)")
    Double findTotalEventBudgetForCurrentMonth();

    // Encuentre el presupuesto total de eventos para el año actual
    @Query("SELECT SUM(o.budget) FROM Event o WHERE YEAR(o.eventDate) = YEAR(CURRENT_DATE)")
    Double findTotalEventBudgetForCurrentYear();

    // Encuentra el próximo evento después de la fecha actual
    Optional<Event> findFirstByEventDateAfterOrderByEventDateAsc(LocalDate currentDate);
}
