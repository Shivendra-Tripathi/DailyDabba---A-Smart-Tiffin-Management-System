package io.github.trip.shiv.dailydabba.web.service;

import io.github.trip.shiv.dailydabba.web.business.exception.MealItemNotFoundException;
import io.github.trip.shiv.dailydabba.web.business.request.meal.CreateMealItemRequest;
import io.github.trip.shiv.dailydabba.web.business.request.meal.UpdateMealItemRequest;
import io.github.trip.shiv.dailydabba.web.entity.MealItem;
import io.github.trip.shiv.dailydabba.web.entity.VendorProfile;
import io.github.trip.shiv.dailydabba.web.repository.MealItemRepository;
import io.github.trip.shiv.dailydabba.web.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MealItemServiceImpl implements MealItemService {

    private final SecurityUtils securityUtils;

    private final MealItemRepository mealItemRepository;
    private final VendorService vendorService;


    @Override
    @Transactional
    @PreAuthorize("hasRole('VENDOR')")
    public MealItem createMealItem(CreateMealItemRequest request) {

        VendorProfile vendor = securityUtils.getAuthenticatedVendor();

        MealItem mealItem = request.toEntity();
        mealItem.setVendor(vendor);

        return mealItemRepository.save(mealItem);
    }

    @Override
    @Transactional(readOnly = true)
    public MealItem getVendorMealItemById(UUID vendorId,UUID mealItemId) {

        return mealItemRepository.findByIdAndVendorId(mealItemId,vendorId)
                .orElseThrow(() -> new MealItemNotFoundException(
                        "Meal item not found: " + mealItemId
                ));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<MealItem> getVendorMealItems(UUID vendorId,Pageable pageable) {

       VendorProfile vendor = vendorService.getVendorById(vendorId);
        return mealItemRepository
                .findByVendorIdAndActiveTrue(vendor.getId(),pageable);


    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('VENDOR')")
    public MealItem updateMealItem(UUID mealItemId, UpdateMealItemRequest request) {

        VendorProfile vendor = securityUtils.getAuthenticatedVendor();
        MealItem mealItem = getVendorMealItemById(vendor.getId(),mealItemId);

        request.applyOn(mealItem);
        return mealItem;
    }


    @Override
    @Transactional
    @PreAuthorize("hasRole('VENDOR')")
    public void deactivateMealItem(UUID mealItemId) {

        VendorProfile vendor = securityUtils.getAuthenticatedVendor();

        MealItem mealItem = getVendorMealItemById(vendor.getId(),mealItemId);
        mealItem.setActive(false);
    }



    @Override
    @Transactional
    @PreAuthorize("hasRole('VENDOR')")
    public void deleteVendorMealItem(UUID mealItemId) {
        VendorProfile vendor = securityUtils.getAuthenticatedVendor();

        MealItem mealItem = getVendorMealItemById(vendor.getId(),mealItemId);
        mealItemRepository.delete(mealItem);
    }
}