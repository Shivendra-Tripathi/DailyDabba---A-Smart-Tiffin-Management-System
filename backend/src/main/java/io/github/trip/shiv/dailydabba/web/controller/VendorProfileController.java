package io.github.trip.shiv.dailydabba.web.controller;

import io.github.trip.shiv.dailydabba.web.business.request.vendor.CreateVendorRequest;
import io.github.trip.shiv.dailydabba.web.business.response.vendor.VendorProfileResponse;
import io.github.trip.shiv.dailydabba.web.entity.User;
import io.github.trip.shiv.dailydabba.web.entity.VendorProfile;
import io.github.trip.shiv.dailydabba.web.security.SecurityUtils;
import io.github.trip.shiv.dailydabba.web.service.VendorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/vendors/profile")
@RequiredArgsConstructor
public class VendorProfileController {

    private final VendorService vendorService;
    private final SecurityUtils securityUtils;

    /**
     * Register the authenticated user's business as a vendor.
     */
    @PostMapping(
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
//    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<VendorProfileResponse> registerBusiness(
            @Valid @RequestPart("request") CreateVendorRequest request,
            @RequestPart(value = "image" , required = false) MultipartFile logoImage
            ) {

        //Get the currently Authenticated User
        User user = securityUtils.getAuthenticatedUser();

        //TODO : Cloudinary Image Upload and setting it in Request is to be done here.

        //Create the Vendor Business
        VendorProfile vendor =
                vendorService.createVendor(
                        user.getId(),
                        request
                );

        VendorProfileResponse response = VendorProfileResponse.fromEntity(vendor);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    /**
     * Get the currently authenticated vendor's profile.
     */
    @GetMapping
    public ResponseEntity<VendorProfileResponse> getMyProfile() {

        //Get the Authenticated User
        User user = securityUtils.getAuthenticatedUser();

        //Create the VendorProfileResponse
        VendorProfileResponse response =
                VendorProfileResponse.fromEntity(
                        vendorService.getVendorByUserId(user.getId()));

        return ResponseEntity.ok(response);
    }
}