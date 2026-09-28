package io.github.trip.shiv.dailydabba.web.repository;

import io.github.trip.shiv.dailydabba.web.entity.Subscription;
import io.github.trip.shiv.dailydabba.web.entity.enums.SubscriptionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.util.List;
import java.util.UUID;

/**
 * The three finder methods below are exactly the three branches the daily
 * scheduling job needs to walk for a given day-of-week:
 *   1) explicit auto-order days (no consent needed)
 *   2) non-auto-order days where the vendor/customer agreed to auto-order anyway
 *   3) non-auto-order days that must first raise a ConsentRequest
 */
@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, UUID> {

    List<Subscription> findByCustomerId(UUID customerId);

    List<Subscription> findByVendorId(UUID vendorId);

    List<Subscription> findByStatus(SubscriptionStatus status);

    List<Subscription> findByCustomerIdAndVendorIdAndStatus(
            UUID customerId, UUID vendorId, SubscriptionStatus status);

    @Query("select s from Subscription s where s.status = " +
            "io.github.trip.shiv.dailydabba.web.entity.enums.SubscriptionStatus.ACTIVE " +
            "and :dayOfWeek member of s.autoOrderDays")
    List<Subscription> findActiveSubscriptionsForAutoOrderDay(@Param("dayOfWeek") DayOfWeek dayOfWeek);

    @Query("select s from Subscription s where s.status = " +
            "io.github.trip.shiv.dailydabba.web.entity.enums.SubscriptionStatus.ACTIVE " +
            "and s.weekendAction = io.github.trip.shiv.dailydabba.web.entity.enums.WeekendAction.AUTO_ORDER " +
            "and :dayOfWeek not member of s.autoOrderDays")
    List<Subscription> findActiveSubscriptionsAutoOrderingOnOffDay(@Param("dayOfWeek") DayOfWeek dayOfWeek);

    @Query("select s from Subscription s where s.status = " +
            "io.github.trip.shiv.dailydabba.web.entity.enums.SubscriptionStatus.ACTIVE " +
            "and s.weekendAction = io.github.trip.shiv.dailydabba.web.entity.enums.WeekendAction.ASK_CONSENT " +
            "and :dayOfWeek not member of s.autoOrderDays")
    List<Subscription> findActiveSubscriptionsNeedingConsentOnOffDay(@Param("dayOfWeek") DayOfWeek dayOfWeek);
}
