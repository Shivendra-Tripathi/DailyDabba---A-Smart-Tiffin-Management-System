package io.github.trip.shiv.dailydabba.web.entity;

import io.github.trip.shiv.dailydabba.web.entity.enums.ConsentStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.Instant;
import java.time.LocalDate;

/**
 * One row per day a Subscription with weekendAction = ASK_CONSENT needs the
 * customer's yes/no before placing an order. If the customer doesn't respond
 * before {@code expiresAt}, a scheduled job flips this to EXPIRED and no
 * order is created (equivalent to a no).
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Entity
@Table(name = "consent_requests", uniqueConstraints = {
        @UniqueConstraint(name = "uk_consent_per_subscription_date", columnNames = {"subscription_id", "requested_date"})
})
public class ConsentRequest extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "subscription_id", nullable = false)
    private Subscription subscription;

    /** The date this consent decision applies to. */
    @Column(name = "requested_date", nullable = false)
    private LocalDate requestedDate;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(name = "status", nullable = false, length = 20)
    private ConsentStatus status = ConsentStatus.PENDING;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Column(name = "responded_at")
    private Instant respondedAt;

    /** Set once approved and the resulting Order has actually been created. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resulting_order_id")
    private Order resultingOrder;
}
