package io.github.trip.shiv.dailydabba.web.entity;

import io.github.trip.shiv.dailydabba.web.entity.enums.MealType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

/**
 * The concrete, dated publication of a vendor's offering - what a customer
 * actually browses and orders from ("today's lunch menu"). Distinct from
 * MenuItem so a vendor can rotate the same catalog items across many days.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Entity
@Table(name = "daily_menus", uniqueConstraints = {
        @UniqueConstraint(name = "uk_vendor_date_mealtype", columnNames = {"vendor_id", "menu_date", "meal_type"})
})
public class DailyMenu extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "vendor_id", nullable = false)
    private VendorProfile vendor;

    @Column(name = "menu_date", nullable = false)
    private LocalDate menuDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "meal_type", nullable = false, length = 20)
    private MealType mealType;

    @ManyToMany
    @JoinTable(
            name = "daily_menu_items",
            joinColumns = @JoinColumn(name = "daily_menu_id"),
            inverseJoinColumns = @JoinColumn(name = "menu_item_id")
    )
    @Builder.Default
    private Set<MealItem> items = new HashSet<>();

    /** Flips true once the vendor's order cutoff time passes for this date/slot. */
    @Builder.Default
    @Column(name = "locked", nullable = false)
    private boolean locked = false;
}
