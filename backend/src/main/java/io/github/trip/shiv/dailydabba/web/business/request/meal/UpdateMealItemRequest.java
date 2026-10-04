package io.github.trip.shiv.dailydabba.web.business.request.meal;

import io.github.trip.shiv.dailydabba.web.entity.MealItem;
import io.github.trip.shiv.dailydabba.web.entity.enums.DietType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;
import lombok.Builder;

import java.math.BigDecimal;

@Builder
public record UpdateMealItemRequest(


        @Size(max = 120, message = "Meal item name must not exceed 120 characters")
        String name,

        @Size(max = 500, message = "Description must not exceed 500 characters")
        String description,

        DietType dietType,

        @DecimalMin(value = "0.01", message = "Price must be greater than 0")
        BigDecimal price,
        Boolean active,
        String imageUrl

) {

    public void applyOn(MealItem mealItem) {
        if (mealItem == null) return;

        if (name != null) mealItem.setName(name);
        if (description != null) mealItem.setDescription(description);
        if (dietType != null) mealItem.setDietType(dietType);
        if (price != null) mealItem.setPrice(price);
        if (active != null) mealItem.setActive(active);
        if (imageUrl != null) mealItem.setImageUrl(imageUrl);
    }
}