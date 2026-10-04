package io.github.trip.shiv.dailydabba.web.business.response.meal;


import io.github.trip.shiv.dailydabba.web.entity.Meal;
import io.github.trip.shiv.dailydabba.web.entity.enums.DietType;
import lombok.Builder;
import lombok.Getter;

import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Getter
@Builder
public class MealResponse {

    private UUID id;

    private UUID vendorId;

    private String name;

    private String description;

    private DietType mealType;

    private Set<MealItemResponse> items;

    private String imageUrl;

    public static MealResponse fromEntity(Meal meal) {
        return MealResponse.builder()
                .id(meal.getId())
                .vendorId(meal.getVendor().getId())
                .name(meal.getName())
                .description(meal.getDescription())
                .mealType(meal.getMealType())
                .items(
                        meal.getItems()
                                .stream()
                                .map(MealItemResponse::fromEntity)
                                .collect(Collectors.toSet())
                ).imageUrl(meal.getImageUrl())
                .build();
    }
}