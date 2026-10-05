package io.github.trip.shiv.dailydabba.web.repository;

import io.github.trip.shiv.dailydabba.web.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID> {

    Page<Notification> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);

    List<Notification> findByUserIdAndReadedFalseOrderByCreatedAtDesc(UUID userId);

    long countByUserIdAndReadedFalse(UUID userId);

    @Modifying
    @Query("update Notification n set n.readed = true where n.user.id = :userId and n.readed = false")
    int markAllAsReadedForUser(@Param("userId") UUID userId);
}
