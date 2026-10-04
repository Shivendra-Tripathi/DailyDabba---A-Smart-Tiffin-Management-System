package io.github.trip.shiv.dailydabba.web.service;

import io.github.trip.shiv.dailydabba.web.business.request.meal.CreateMealItemRequest;
import io.github.trip.shiv.dailydabba.web.business.request.meal.UpdateMealItemRequest;
import io.github.trip.shiv.dailydabba.web.business.response.meal.MealItemResponse;
import io.github.trip.shiv.dailydabba.web.entity.MealItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface MealItemService {

    MealItem createMealItem(
            CreateMealItemRequest request
    );

    MealItem getVendorMealItemById(
            UUID vendorId,
            UUID mealItemId
    );

    Page<MealItem> getVendorMealItems(UUID vendorId,Pageable pageable);

    MealItem updateMealItem(
            UUID mealItemId,
            UpdateMealItemRequest request
    );

    void deactivateMealItem(
            UUID mealItemId
    );

    void deleteVendorMealItem(
            UUID mealItemId
    );
}