package io.github.trip.shiv.dailydabba.web.entity;

import io.github.trip.shiv.dailydabba.web.entity.enums.MealType;
import io.github.trip.shiv.dailydabba.web.entity.enums.SubscriptionStatus;
import io.github.trip.shiv.dailydabba.web.entity.enums.WeekendAction;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Feature #7: lets a customer set up a standing, recurring order with a
 * vendor instead of ordering manually every day.
 * <p>
 * - {@code autoOrderDays} (typically Mon-Fri) place an order automatically,
 *   no explicit tap needed each day.
 * - {@code weekendAction} controls what happens on the remaining days:
 *   skip entirely (NO_ORDER), ask first via a ConsentRequest (ASK_CONSENT),
 *   or just treat them the same as an auto-order day (AUTO_ORDER).
 * <p>
 * A scheduled job reads active subscriptions each day, and either creates an
 * Order directly (auto-order day) or creates a ConsentRequest and waits for
 * the customer's response (ask-consent day).
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Entity
@Table(name = "subscriptions")
public class Subscription extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    private CustomerProfile customer;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "vendor_id", nullable = false)
    private VendorProfile vendor;

    @Enumerated(EnumType.STRING)
    @Column(name = "meal_type", nullable = false, length = 20)
    private MealType mealType;

    /** Days on which the order is placed automatically with no explicit consent. */
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "subscription_auto_order_days", joinColumns = @JoinColumn(name = "subscription_id"))
    @Column(name = "day_of_week", length = 15)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Set<DayOfWeek> autoOrderDays = new HashSet<>();

    /** What to do on the days not covered by autoOrderDays (e.g. weekends). */
    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(name = "weekend_action", nullable = false, length = 20)
    private WeekendAction weekendAction = WeekendAction.NO_ORDER;

    /** Fallback meal used when no poll result / explicit item choice is available. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "preferred_menu_item_id")
    private MenuItem preferredMenuItem;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(name = "status", nullable = false, length = 20)
    private SubscriptionStatus status = SubscriptionStatus.ACTIVE;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    /** Time of day the auto-order job runs / finalizes orders for this subscription. */
    @Column(name = "auto_confirm_deadline")
    private LocalTime autoConfirmDeadline;
}
