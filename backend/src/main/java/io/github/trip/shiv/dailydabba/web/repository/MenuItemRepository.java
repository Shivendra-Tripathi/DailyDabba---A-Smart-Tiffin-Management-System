package io.github.trip.shiv.dailydabba.web.repository;

import io.github.trip.shiv.dailydabba.web.entity.MenuItem;
import io.github.trip.shiv.dailydabba.web.entity.enums.DietType;
import io.github.trip.shiv.dailydabba.web.entity.enums.MealType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, UUID> {

    List<MenuItem> findByVendorId(UUID vendorId);

    List<MenuItem> findByVendorIdAndActiveTrue(UUID vendorId);

    List<MenuItem> findByVendorIdAndMealTypeAndActiveTrue(UUID vendorId, MealType mealType);

    List<MenuItem> findByVendorIdAndDietTypeAndActiveTrue(UUID vendorId, DietType dietType);

    boolean existsByIdAndVendorId(UUID id, UUID vendorId);
}
