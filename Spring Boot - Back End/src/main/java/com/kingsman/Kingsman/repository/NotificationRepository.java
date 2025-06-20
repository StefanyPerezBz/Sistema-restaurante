package com.kingsman.Kingsman.repository;

import com.kingsman.Kingsman.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByForWho(String forWho);
    List<Notification> findByCreatedAtBefore(LocalDateTime cutoffDate);
}
