package io.github.trip.shiv.dailydabba.web.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "weekly_plans")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class WeeklyPlan extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "vendor_id", nullable = false)
    private VendorProfile vendor;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(length = 500)
    private String description;

    @OneToMany(
            mappedBy = "weeklyPlan",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @Builder.Default
    private Set<WeeklyPlanDay> days = new HashSet<>();

    @Builder.Default
    private boolean active = false;
}