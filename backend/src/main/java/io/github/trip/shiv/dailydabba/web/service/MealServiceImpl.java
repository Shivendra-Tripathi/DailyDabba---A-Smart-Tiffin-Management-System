package io.github.trip.shiv.dailydabba.web.service;


import io.github.trip.shiv.dailydabba.web.business.exception.MealNotFoundException;
import io.github.trip.shiv.dailydabba.web.business.request.meal.CreateMealRequest;
import io.github.trip.shiv.dailydabba.web.business.request.meal.UpdateMealRequest;
import io.github.trip.shiv.dailydabba.web.entity.Meal;
import io.github.trip.shiv.dailydabba.web.entity.MealItem;
import io.github.trip.shiv.dailydabba.web.entity.VendorProfile;
import io.github.trip.shiv.dailydabba.web.repository.MealRepository;
import io.github.trip.shiv.dailydabba.web.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MealServiceImpl implements MealService {

    private final SecurityUtils securityUtils;

    private final MealRepository mealRepository;
    private final VendorService vendorService;
    private final MealItemService mealItemService;

    @Override
    @Transactional
    @PreAuthorize("hasRole('VENDOR')")
    public Meal createMeal(CreateMealRequest request) {

        VendorProfile vendor = securityUtils.getAuthenticatedVendor();

        //Stream maps the mealItemIds-> mealItems
        Meal meal = request.toEntity(
                request
                        .getMealItemIds()
                        .stream()
                        .map(mealItemId -> mealItemService.getVendorMealItemById(vendor.getId(),mealItemId))
                        .collect(Collectors.toSet())
        );

        meal.setVendor(vendor);

        return mealRepository.save(meal);
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('VENDOR')")
    public Meal updateMeal(UUID mealId,UpdateMealRequest request) {
        VendorProfile vendor = securityUtils.getAuthenticatedVendor();
        Meal meal = getVendorMealById(vendor.getId(),mealId);
        Set<MealItem> mealItems = request.getMealItemIds().stream()
                .map(
                        mealItemId -> mealItemService.getVendorMealItemById(vendor.getId(),mealItemId)
                )
                .collect(Collectors.toSet());
        request.applyOn(meal,mealItems);
        return  mealRepository.save(meal);
    }

    @Override
    @Transactional(readOnly = true)
    public Meal getVendorMealById(UUID vendorId, UUID mealId) {

        return mealRepository.findByIdAndVendorId(mealId, vendorId)
                .orElseThrow(() -> new MealNotFoundException(
                        "Meal not found: " + mealId
                ));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Meal> getVendorMeals(
            UUID vendorId,
            Pageable pageable
    ) {

        VendorProfile vendor = vendorService.getVendorById(vendorId);

        return mealRepository
                .findByVendorId(vendor.getId(), pageable);
    }


    @Override
    @Transactional
    @PreAuthorize("hasRole('VENDOR')")
    public void deleteVendorMeal(UUID mealId) {

        //Load the Vendor
        VendorProfile vendor = securityUtils.getAuthenticatedVendor();
        Meal meal = getVendorMealById(vendor.getId(),mealId);
        mealRepository.delete(meal);
    }
}