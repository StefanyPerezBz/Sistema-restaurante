package com.restaurante.restaurante.service;

import com.restaurante.restaurante.controller.AttendanceDTO;
import com.restaurante.restaurante.model.Attendance;
import com.restaurante.restaurante.model.InAttendance;
import com.restaurante.restaurante.model.OutAttendance;
import com.restaurante.restaurante.repository.AttendanceRepository;
import com.restaurante.restaurante.repository.InAttendanceRepository;
import com.restaurante.restaurante.repository.OutAttendanceRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Service
@Transactional
public class AttendanceService {

    @Autowired
    private EntityManager entityManager;

    public List<Object[]> getAttendanceData() {
        // Obtenga la fecha de hoy
        LocalDate today = LocalDate.now();

        // Construya la consulta JPQL para recuperar los datos de asistencia de hoy
        String jpql = "SELECT i.empId, i.position, i.date, i.inTime, o.outTime " +
                "FROM InAttendance i " +
                "LEFT JOIN OutAttendance o ON i.empId = o.empID AND i.date = o.date " +
                "WHERE i.date = :date";

        // Crear el objeto de consulta
        Query query = entityManager.createQuery(jpql);

        // Formatee la fecha de hoy como una cadena en el formato aaaa-MM-dd
        String formattedDate = today.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));

        // Convierte la cadena de fecha formateada a LocalDate
        LocalDate dateParameter = LocalDate.parse(formattedDate);

        // Establezca el parámetro para la fecha
        query.setParameter("date", dateParameter);

        // Ejecutar la consulta y devolver la lista de resultados
        List<Object[]> resultList = query.getResultList();

        // Comprueba si resultList está vacío. Si es así, devuelve el mensaje "Aún no hay asistencia disponible para hoy"
        if (resultList.isEmpty()) {
            return Collections.singletonList(new String[]{"Aún no hay asistencia disponible para hoy"});
        }

        // Iterar sobre la lista de resultados y manejar valores outTime nulos
        for (Object[] result : resultList) {
            if (result[4] == null) {
                result[4] = "Still Working";
            }
        }

        return resultList;
    }

    private final AttendanceRepository attendanceRepository;

    // Inyección de constructor de AttendanceRepository
    public AttendanceService(AttendanceRepository attendanceRepository) {
        this.attendanceRepository = attendanceRepository;
    }

    public List<AttendanceDTO> getAttendanceForCurrentDate() {
        LocalDate currentDate = LocalDate.now();
        List<Attendance> attendanceList = attendanceRepository.findByDate(currentDate);

        // Convertir entidades de asistencia en DTO personalizados
        return attendanceList.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // Metodo auxiliar para asignar la entidad de asistencia a un DTO personalizado
    private AttendanceDTO mapToDTO(Attendance attendance) {
        AttendanceDTO dto = new AttendanceDTO();
        dto.setEmpId(attendance.getEmpId());
        dto.setEmpName(attendance.getEmpName());
        dto.setPosition(attendance.getPosition());
        dto.setDate(attendance.getDate());
        dto.setInTime(attendance.getInTime());
        dto.setOutTime(attendance.getOutTime());
        return dto;
    }

    //delete

    public void deleteAttendance(String empId, LocalDate date) {
        attendanceRepository.deleteByEmpIdAndDate(empId, date);
    }


    //current month attendance
    public List<Attendance> getAttendanceForCurrentMonth() {
        // Obtener el año y mes actual
        YearMonth currentYearMonth = YearMonth.now();

        // Obtener el primer día del mes actual
        LocalDate firstDayOfMonth = currentYearMonth.atDay(1);

        // Obtener el último día del mes actual
        LocalDate lastDayOfMonth = currentYearMonth.atEndOfMonth();

        // Recuperar registros de asistencia dentro del mes actual
        return attendanceRepository.findByDateBetween(firstDayOfMonth, lastDayOfMonth);
    }

}


