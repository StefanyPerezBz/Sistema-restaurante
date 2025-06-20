package com.kingsman.Kingsman.repository;

import com.kingsman.Kingsman.model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    Attendance findByEmpIdAndDate(String empId, LocalDate now);

    List<Attendance> findByDate(LocalDate date);
    void deleteByEmpIdAndDate(String empId, LocalDate date);

    List<Attendance> findByDateBetween(LocalDate startDate, LocalDate endDate);

    List<Attendance> findByEmpIdAndDateBetween(String empId, LocalDate startDate, LocalDate endDate);



}
