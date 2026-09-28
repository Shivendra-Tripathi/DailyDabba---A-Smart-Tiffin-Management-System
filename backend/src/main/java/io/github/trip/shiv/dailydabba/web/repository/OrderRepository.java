package io.github.trip.shiv.dailydabba.web.repository;

import io.github.trip.shiv.dailydabba.web.entity.Order;
import io.github.trip.shiv.dailydabba.web.entity.enums.MealType;
import io.github.trip.shiv.dailydabba.web.entity.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * JpaSpecificationExecutor backs the vendor "manage orders" screen, where
 * filters (status, date range, meal type) are combined dynamically.
 */
@Repository
public interface OrderRepository extends JpaRepository<Order, UUID>, JpaSpecificationExecutor<Order> {

    Page<Order> findByCustomerId(UUID customerId, Pageable pageable);

    Page<Order> findByVendorId(UUID vendorId, Pageable pageable);

    List<Order> findByVendorIdAndDeliveryDate(UUID vendorId, LocalDate deliveryDate);

    List<Order> findByVendorIdAndDeliveryDateAndStatus(
            UUID vendorId, LocalDate deliveryDate, OrderStatus status);

    List<Order> findByCustomerIdAndDeliveryDateBetween(
            UUID customerId, LocalDate startDate, LocalDate endDate);

    /** Used by the subscription job to avoid double-placing an auto-order for the same day. */
    Optional<Order> findBySubscriptionIdAndDeliveryDate(UUID subscriptionId, LocalDate deliveryDate);

    boolean existsByCustomerIdAndVendorIdAndDeliveryDateAndMealType(
            UUID customerId, UUID vendorId, LocalDate deliveryDate, MealType mealType);

    long countByVendorIdAndDeliveryDateAndStatus(UUID vendorId, LocalDate deliveryDate, OrderStatus status);

    List<Order> findByStatusAndDeliveryDate(OrderStatus status, LocalDate deliveryDate);

    @Query("select coalesce(sum(o.totalAmount), 0) from Order o " +
            "where o.vendor.id = :vendorId and o.deliveryDate between :startDate and :endDate " +
            "and o.status not in (io.github.trip.shiv.dailydabba.web.entity.enums.OrderStatus.CANCELLED, " +
            "io.github.trip.shiv.dailydabba.web.entity.enums.OrderStatus.REJECTED)")
    BigDecimal sumRevenueForVendorBetween(@Param("vendorId") UUID vendorId,
                                          @Param("startDate") LocalDate startDate,
                                          @Param("endDate") LocalDate endDate);
}
