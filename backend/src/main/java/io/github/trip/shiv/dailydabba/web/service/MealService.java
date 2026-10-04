package io.github.trip.shiv.dailydabba.web.service;

import io.github.trip.shiv.dailydabba.web.business.request.meal.CreateMealRequest;
import io.github.trip.shiv.dailydabba.web.business.request.meal.UpdateMealRequest;
import io.github.trip.shiv.dailydabba.web.business.response.meal.MealResponse;
import io.github.trip.shiv.dailydabba.web.entity.Meal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface MealService {

    Meal createMeal(CreateMealRequest request);

    Meal updateMeal(UUID mealId,UpdateMealRequest request);

    Meal getVendorMealById(UUID vendorId, UUID mealId);

    Page<Meal> getVendorMeals(UUID vendorId, Pageable pageable);

    void deleteVendorMeal( UUID mealId);
}