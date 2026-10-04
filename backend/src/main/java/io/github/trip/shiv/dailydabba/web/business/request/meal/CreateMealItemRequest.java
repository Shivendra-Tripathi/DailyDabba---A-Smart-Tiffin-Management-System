package io.github.trip.shiv.dailydabba.web.business.request.meal;

import io.github.trip.shiv.dailydabba.web.entity.MealItem;
import io.github.trip.shiv.dailydabba.web.entity.enums.DietType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateMealItemRequest {

    @NotBlank
    @Size(max = 120)
    private String name;

    @Size(max = 500)
    private String description;

    @NotNull
    private DietType dietType;

    @NotNull
    @DecimalMin(value = "0.01")
    private BigDecimal price;

    @Size(max = 500)
    private String imageUrl;

    public MealItem toEntity() {
        return MealItem.builder()
                .name(name)
                .description(description)
                .dietType(dietType)
                .price(price)
                .imageUrl(imageUrl)
                .active(true)
                .build();
    }
}
