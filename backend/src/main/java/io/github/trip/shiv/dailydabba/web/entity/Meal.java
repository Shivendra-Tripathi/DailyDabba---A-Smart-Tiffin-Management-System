package io.github.trip.shiv.dailydabba.web.entity;

import io.github.trip.shiv.dailydabba.web.entity.enums.DietType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Entity
@Table(
        name = "meals",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_meal_vendor_name",
                        columnNames = {"vendor_id", "name"}
                )
        }
)
public class Meal extends BaseEntity{

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "vendor_id" , nullable = false)
    private VendorProfile vendor;

    @Column(name = "name", nullable = false, length = 120)
    private String name;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name="image_url",length = 500)
    @Builder.Default
    private String imageUrl = null;

    @ManyToMany
    @JoinTable(
            name = "meal_mealitems_joined",
            joinColumns = @JoinColumn(name = "meal_id"),
            inverseJoinColumns = @JoinColumn(name = "meal_item_id")
    )
    @Builder.Default
    private Set<MealItem> items = new HashSet<>();

    @Transient
    public DietType getMealType() {
        return DietType.getUpperBoundType(items);
    }
}
