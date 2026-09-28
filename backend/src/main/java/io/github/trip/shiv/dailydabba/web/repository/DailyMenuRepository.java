package io.github.trip.shiv.dailydabba.web.repository;

import io.github.trip.shiv.dailydabba.web.entity.DailyMenu;
import io.github.trip.shiv.dailydabba.web.entity.enums.MealType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DailyMenuRepository extends JpaRepository<DailyMenu, UUID> {

    Optional<DailyMenu> findByVendorIdAndMenuDateAndMealType(
            UUID vendorId, LocalDate menuDate, MealType mealType);

    List<DailyMenu> findByVendorIdAndMenuDate(UUID vendorId, LocalDate menuDate);

    /** Menus still open for ordering on a given date - used by the ordering flow. */
    List<DailyMenu> findByMenuDateAndLockedFalse(LocalDate menuDate);

    boolean existsByVendorIdAndMenuDateAndMealType(UUID vendorId, LocalDate menuDate, MealType mealType);

    /** Flips a menu closed once the vendor's order cutoff time passes for that slot. */
    @Modifying
    @Query("update DailyMenu d set d.locked = true where d.vendor.id = :vendorId " +
            "and d.menuDate = :menuDate and d.mealType = :mealType")
    int lockMenu(@Param("vendorId") UUID vendorId,
                 @Param("menuDate") LocalDate menuDate,
                 @Param("mealType") MealType mealType);
}
