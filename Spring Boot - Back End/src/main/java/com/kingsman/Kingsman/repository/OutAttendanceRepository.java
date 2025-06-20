package com.kingsman.Kingsman.repository;

import com.kingsman.Kingsman.model.OutAttendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface OutAttendanceRepository extends JpaRepository<OutAttendance, Long> {

    Optional<OutAttendance> findByEmpIDAndDate(String empId, LocalDate date);
}
