package io.github.trip.shiv.dailydabba.web.repository;

import io.github.trip.shiv.dailydabba.web.entity.Payment;
import io.github.trip.shiv.dailydabba.web.entity.enums.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {

    Optional<Payment> findByOrderId(UUID orderId);

    Optional<Payment> findByGatewayTransactionId(String gatewayTransactionId);

    /** Vendor's "payments" tab, filterable by status (e.g. FAILED to chase up). */
    Page<Payment> findByOrder_Vendor_IdAndStatus(UUID vendorId, PaymentStatus status, Pageable pageable);

    Page<Payment> findByOrder_Customer_Id(UUID customerId, Pageable pageable);

    boolean existsByOrderIdAndStatus(UUID orderId, PaymentStatus status);
}
