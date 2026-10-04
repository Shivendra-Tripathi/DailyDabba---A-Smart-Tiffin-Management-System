package io.github.trip.shiv.dailydabba.web.controller;

import io.github.trip.shiv.dailydabba.web.business.request.meal.CreateMealRequest;
import io.github.trip.shiv.dailydabba.web.business.request.meal.UpdateMealRequest;
import io.github.trip.shiv.dailydabba.web.business.response.meal.MealResponse;
import io.github.trip.shiv.dailydabba.web.entity.Meal;
import io.github.trip.shiv.dailydabba.web.entity.VendorProfile;
import io.github.trip.shiv.dailydabba.web.security.SecurityUtils;
import io.github.trip.shiv.dailydabba.web.service.MealService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RequestMapping("/api/v1/meals")
@RestController
@RequiredArgsConstructor
public class MealController {


    private final MealService mealService;
    private final SecurityUtils securityUtils;

    //NOTE: Vendor Endpoints
    //-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0
    @PostMapping(
            value = "/vendor",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    @PreAuthorize("hasRole('VENDOR')")
    ResponseEntity<MealResponse> createMealByVendor(
           @Valid @RequestPart("request") CreateMealRequest request,
            @RequestPart(value="image", required=false) MultipartFile image
    ){

        //Explicitly ensures the Vendor auth.
        VendorProfile vendorProfile = securityUtils.getAuthenticatedVendor();

        //TODO : image Upload and setting it in the request is to be done here

        Meal meal = mealService.createMeal(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(MealResponse.fromEntity(meal));
    }

    @GetMapping("/vendor/{mealId}")
    @PreAuthorize("hasRole('VENDOR')")
    ResponseEntity<MealResponse> getMealByVendor(
            @PathVariable UUID mealId
    ){
        //Load the Vendor
        VendorProfile vendorProfile = securityUtils.getAuthenticatedVendor();

        Meal meal = mealService.getVendorMealById(vendorProfile.getId(),mealId);
        return ResponseEntity
                .ok(MealResponse.fromEntity(meal));
    }



    @GetMapping("/vendor")
    @PreAuthorize("hasRole('VENDOR')")
    ResponseEntity<Page<MealResponse>> getMealsByVendor(
            @PageableDefault(size = 10) Pageable pageable){
        //Explicitly ensures the Vendor auth.
        VendorProfile vendorProfile = securityUtils.getAuthenticatedVendor();

        Page<MealResponse> mealResponses = mealService.getVendorMeals(vendorProfile.getId(),pageable)
                .map(MealResponse::fromEntity);
        return ResponseEntity
                .ok(mealResponses);
    }

    @PutMapping(
            value = "/vendor/{mealId}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    @PreAuthorize("hasRole('VENDOR')")
    ResponseEntity<MealResponse> updateMealByVendor(
            @PathVariable UUID mealId,
            @Valid @RequestPart("request") UpdateMealRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image
    ){
        //Explicitly ensures the Vendor auth.
        VendorProfile vendorProfile = securityUtils.getAuthenticatedVendor();

        //TODO : Update the Image in the database and set it in the Request.

        Meal meal = mealService.updateMeal(mealId,request);
        return  ResponseEntity
                .ok(MealResponse.fromEntity(meal));
    }

    @DeleteMapping("/vendor/{mealId}")
    @PreAuthorize("hasRole('VENDOR')")
    ResponseEntity<Void> deleteMealByVendor(
            @PathVariable UUID mealId
    ){
        //Explicitly ensures the Vendor auth.
        VendorProfile vendorProfile = securityUtils.getAuthenticatedVendor();

        mealService.deleteVendorMeal(mealId);
        return ResponseEntity
                .status(HttpStatus.NO_CONTENT)
                .build();
    }
    //-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0






    //Note: Customer Endpoints
    //-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0


    @GetMapping("/customer/{mealId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    ResponseEntity<MealResponse> getMealByCustomer(
            @PathVariable UUID mealId,
            @RequestParam UUID vendorId
    ){

        Meal meal = mealService.getVendorMealById(vendorId,mealId);
        return ResponseEntity
                .ok(MealResponse.fromEntity(meal));
    }



    @GetMapping("/customer")
    @PreAuthorize("hasRole('CUSTOMER')")
    ResponseEntity<Page<MealResponse>> getMealsByCustomer(
            @RequestParam UUID vendorId,
            @PageableDefault(size = 10) Pageable pageable){

        Page<MealResponse> mealResponses = mealService.getVendorMeals(vendorId,pageable)
                .map(MealResponse::fromEntity);
        return ResponseEntity
                .ok(mealResponses);
    }



    //-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0
}
