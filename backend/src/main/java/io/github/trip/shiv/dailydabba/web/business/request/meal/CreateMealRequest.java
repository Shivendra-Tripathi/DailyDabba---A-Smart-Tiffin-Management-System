package io.github.trip.shiv.dailydabba.web.business.request.meal;

import io.github.trip.shiv.dailydabba.web.entity.Meal;
import io.github.trip.shiv.dailydabba.web.entity.MealItem;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;
import java.util.UUID;


@Getter
@Setter
public class CreateMealRequest {

    @NotBlank
    @Size(max = 120)
    private String name;

    @Size(max = 500)
    private String description;

    @NotEmpty
    private Set<UUID> mealItemIds;

    public Meal toEntity(Set<MealItem> items) {
        return Meal.builder()
                .name(name)
                .description(description)
                .items(items)
                .build();
    }
}