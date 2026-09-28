package io.github.trip.shiv.dailydabba.web.repository;

import io.github.trip.shiv.dailydabba.web.entity.ConsentRequest;
import io.github.trip.shiv.dailydabba.web.entity.enums.ConsentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ConsentRequestRepository extends JpaRepository<ConsentRequest, UUID> {

    Optional<ConsentRequest> findBySubscriptionIdAndRequestedDate(UUID subscriptionId, LocalDate requestedDate);

    boolean existsBySubscriptionIdAndRequestedDate(UUID subscriptionId, LocalDate requestedDate);

    /** A scheduled job flips these to EXPIRED (treated as "no order") once past due. */
    List<ConsentRequest> findByStatusAndExpiresAtBefore(ConsentStatus status, Instant instant);

    /** Customer's "needs your response" inbox. */
    List<ConsentRequest> findBySubscription_Customer_IdAndStatus(UUID customerId, ConsentStatus status);

    List<ConsentRequest> findByStatus(ConsentStatus status);
}
