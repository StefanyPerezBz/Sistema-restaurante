package com.restaurante.restaurante.repository;

import com.restaurante.restaurante.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeedbackRepository extends JpaRepository<Feedback,Long> {

}
