package com.kingsman.Kingsman.repository;

import com.kingsman.Kingsman.model.InAttendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface InAttendanceRepository extends JpaRepository<InAttendance, Long> {


    Optional<InAttendance> findByEmpIdAndDate(String empId, LocalDate date);

    List<InAttendance> findByDate(LocalDate currentDate);
}
