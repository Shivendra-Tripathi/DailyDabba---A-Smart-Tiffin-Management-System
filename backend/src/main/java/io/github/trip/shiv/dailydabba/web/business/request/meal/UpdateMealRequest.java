package io.github.trip.shiv.dailydabba.web.business.request.meal;

import io.github.trip.shiv.dailydabba.web.entity.Meal;
import io.github.trip.shiv.dailydabba.web.entity.MealItem;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;
import java.util.UUID;

@Getter
@Setter
public class UpdateMealRequest {


    @Size(max = 120)
    private String name;

    @Size(max = 500)
    private String description;

    @NotNull(message = "mealItems can't be null while updating a Meal")
    private Set<UUID> mealItemIds;

    private String imageUrl;

    public void applyOn(Meal meal, Set<MealItem> mealItems) {
       meal.setName(name);
       meal.setDescription(description);
       meal.setItems(mealItems);
       meal.setImageUrl(imageUrl);
    }
}
