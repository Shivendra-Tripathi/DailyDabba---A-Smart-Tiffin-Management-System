package io.github.trip.shiv.dailydabba.web.repository;

import io.github.trip.shiv.dailydabba.web.entity.MealItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface MealItemRepository extends JpaRepository<MealItem, UUID> {

    Page<MealItem> findByVendorId(UUID vendorId, Pageable pageable);

    Page<MealItem> findByVendorIdAndActiveTrue(UUID vendorId, Pageable pageable);


    Optional<MealItem> findByIdAndVendorId(UUID id, UUID vendorId);

    Optional<MealItem> findByIdAndVendorIdAndActiveTrue(UUID id, UUID vendorId);

    boolean existsByIdAndVendorId(UUID id, UUID vendorId);

    boolean existsByVendorIdAndNameIgnoreCase(UUID vendorId, String name);
}