package io.github.trip.shiv.dailydabba.web.entity;

import io.github.trip.shiv.dailydabba.web.entity.enums.DietType;
import io.github.trip.shiv.dailydabba.web.entity.enums.MealType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

/**
 * A vendor's reusable catalog item (e.g. "Paneer Thali"). DailyMenu picks
 * from these to publish what's actually available on a given date.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Entity
@Table(
        name = "meal_items",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_meal_item_vendor_name",
                        columnNames = {"vendor_id", "name"}
                )
        }
)
public class MealItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "vendor_id", nullable = false)
    private VendorProfile vendor;

    @Column(name = "name", nullable = false, length = 120)
    private String name;

    @Column(name = "description", length = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "diet_type", nullable = false, length = 20)
    private DietType dietType;

    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Builder.Default
    @Column(name = "active", nullable = false)
    private boolean active = true;

    @Column(name = "image_url")
    private String imageUrl;
}
