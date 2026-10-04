package io.github.trip.shiv.dailydabba.web.controller;

import io.github.trip.shiv.dailydabba.web.business.request.meal.CreateMealItemRequest;
import io.github.trip.shiv.dailydabba.web.business.request.meal.UpdateMealItemRequest;
import io.github.trip.shiv.dailydabba.web.business.response.meal.MealItemResponse;
import io.github.trip.shiv.dailydabba.web.entity.MealItem;
import io.github.trip.shiv.dailydabba.web.entity.VendorProfile;
import io.github.trip.shiv.dailydabba.web.security.SecurityUtils;
import io.github.trip.shiv.dailydabba.web.service.MealItemService;
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

@RestController
@RequestMapping("/api/v1/meal-items")
@RequiredArgsConstructor
public class MealItemController {

    private final MealItemService mealItemService;
    private final SecurityUtils  securityUtils;



    // NOTE: VENDOR ENDPOINTS
    //-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0
    @PostMapping(
            value ="/vendor",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<MealItemResponse> createMealItemByVendor(
            @Valid @RequestPart("request") CreateMealItemRequest request,
            @RequestPart(value = "image",required = false) MultipartFile image ) {

        //Ensures that Vendor is authenticated.
        VendorProfile vendor = securityUtils.getAuthenticatedVendor();


        //TODO : Image Upload and Setting into Request is to be done here

        MealItem mealItem = mealItemService.createMealItem(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(MealItemResponse.fromEntity(mealItem));
    }



    @GetMapping("/vendor/{id}")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<MealItemResponse> getMealItemForVendorByVendor(
            @PathVariable UUID id) {

        //Load the Authenticated Vendor
        VendorProfile vendor = securityUtils.getAuthenticatedVendor();

        MealItem mealItem = mealItemService.getVendorMealItemById(vendor.getId(), id);

        return ResponseEntity
                .ok(MealItemResponse.fromEntity(mealItem));
    }


    @GetMapping("/vendor")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<Page<MealItemResponse>> getMealItemsByVendor(
            @PageableDefault(size = 10) Pageable pageable) {

        //Load the Vendor
        VendorProfile vendor = securityUtils.getAuthenticatedVendor();

        Page<MealItemResponse> page =
                mealItemService
                        .getVendorMealItems(vendor.getId(), pageable)
                .map(MealItemResponse::fromEntity);

        return  ResponseEntity
                .ok(page);
    }

    @PutMapping(
           value = "/vendor/{id}",
    consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<MealItemResponse> updateMealItemByVendor(
            @PathVariable UUID id,
            @Valid @RequestPart(value = "request") UpdateMealItemRequest request,
            @RequestPart(value = "image",required = false) MultipartFile image ) {

        //Ensures that Vendor is authenticated.
        VendorProfile vendor = securityUtils.getAuthenticatedVendor();

        //TODO : Image Upload and Setting the URL in request is to be done here

        //Internally loads the VendorProfile
        MealItem mealItem = mealItemService.updateMealItem(id,request);
        return ResponseEntity
                .ok(MealItemResponse.fromEntity(mealItem));
    }

    @DeleteMapping("/vendor/{id}")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<Void> deleteMealItemByVendor(
            @PathVariable UUID id) {

        //Ensures that Vendor is authenticated.
        VendorProfile vendor = securityUtils.getAuthenticatedVendor();

        //Internally load the VendorProfile
        mealItemService.deactivateMealItem(id);
        return ResponseEntity.noContent().build();
    }
    //-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0



    //NOTE : CUSTOMER ENDPOINT
    //-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0

    @GetMapping("/customer/{mealItemId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<MealItemResponse> getMealItemByCustomer(
            @PathVariable UUID mealItemId,
            @RequestParam UUID vendorId) {

        MealItem mealItem =
                mealItemService.getVendorMealItemById(vendorId, mealItemId);

        return ResponseEntity.ok(
                MealItemResponse.fromEntity(mealItem)
        );
    }

    @GetMapping("/customer")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<Page<MealItemResponse>> getMealItemsByCustomer(
            @RequestParam("vendorId") UUID vendorId,
            @PageableDefault(size = 10) Pageable pageable) {

        Page<MealItemResponse> page =
                mealItemService
                        .getVendorMealItems(vendorId, pageable)
                        .map(MealItemResponse::fromEntity);

        return  ResponseEntity
                .ok(page);
    }


    //-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0

}
