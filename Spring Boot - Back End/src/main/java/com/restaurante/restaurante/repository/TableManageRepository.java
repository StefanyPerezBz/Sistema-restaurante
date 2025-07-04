package com.restaurante.restaurante.repository;

import com.restaurante.restaurante.model.TableManage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TableManageRepository extends JpaRepository<TableManage,Long> {

    boolean existsByTableNumber(int tableNumber);

    // Metodo para buscar mesas según disponibilidad
    List<TableManage> findByTableAvailability(boolean availability);

    //
    TableManage findByTableNumber(int tableNumber);

}
