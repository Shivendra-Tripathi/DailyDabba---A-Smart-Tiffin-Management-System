package io.github.trip.shiv.dailydabba.web.repository;

import io.github.trip.shiv.dailydabba.web.entity.WeeklyPlan;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface WeeklyPlanRepository extends JpaRepository<WeeklyPlan, UUID> {

    Page<WeeklyPlan> findByVendorId(
            UUID vendorId,
            Pageable pageable
    );

    Page<WeeklyPlan> findByVendorIdAndActiveTrue(
            UUID vendorId,
            Pageable pageable
    );

    Optional<WeeklyPlan> findByIdAndVendorId(
            UUID planId,
            UUID vendorId
    );

    Optional<WeeklyPlan> findByIdAndVendorIdAndActiveTrue(
            UUID planId,
            UUID vendorId
    );

    boolean existsByIdAndVendorId(
            UUID planId,
            UUID vendorId
    );

    boolean existsByVendorIdAndNameIgnoreCase(
            UUID vendorId,
            String name
    );
}