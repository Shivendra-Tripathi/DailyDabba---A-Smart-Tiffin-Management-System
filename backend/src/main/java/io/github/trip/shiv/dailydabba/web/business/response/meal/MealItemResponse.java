package io.github.trip.shiv.dailydabba.web.business.response.meal;

import io.github.trip.shiv.dailydabba.web.entity.MealItem;
import io.github.trip.shiv.dailydabba.web.entity.enums.DietType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MealItemResponse {

    private UUID id;
    private String name;
    private String description;
    private DietType dietType;
    private BigDecimal price;
    private String imageUrl;

    public static MealItemResponse fromEntity(MealItem mealItem) {
        return MealItemResponse.builder()
                .id(mealItem.getId())
                .name(mealItem.getName())
                .description(mealItem.getDescription())
                .dietType(mealItem.getDietType())
                .price(mealItem.getPrice())
                .imageUrl(mealItem.getImageUrl())
                .build();
    }
}