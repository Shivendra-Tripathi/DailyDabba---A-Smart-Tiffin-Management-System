package io.github.trip.shiv.dailydabba.web.repository;

import io.github.trip.shiv.dailydabba.web.entity.Meal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface MealRepository extends JpaRepository<Meal, UUID> {

    Page<Meal> findByVendorId(UUID vendorId, Pageable pageable);

    Optional<Meal> findByIdAndVendorId(UUID mealId, UUID vendorId);

    boolean existsByIdAndVendorId(UUID mealId, UUID vendorId);

    boolean existsByVendorIdAndNameIgnoreCase(UUID vendorId, String name);
}