package com.restaurante.restaurante.repository;

import com.restaurante.restaurante.model.Bonus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BonusRepository extends JpaRepository<Bonus,Long > {
}
