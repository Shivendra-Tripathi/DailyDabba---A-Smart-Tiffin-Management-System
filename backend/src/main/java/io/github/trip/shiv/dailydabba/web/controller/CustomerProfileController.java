package io.github.trip.shiv.dailydabba.web.controller;

import io.github.trip.shiv.dailydabba.web.business.request.customer.CreateCustomerRequest;
import io.github.trip.shiv.dailydabba.web.business.request.customer.UpdateCustomerRequest;
import io.github.trip.shiv.dailydabba.web.business.response.customer.CustomerResponse;
import io.github.trip.shiv.dailydabba.web.entity.CustomerProfile;
import io.github.trip.shiv.dailydabba.web.entity.User;
import io.github.trip.shiv.dailydabba.web.security.SecurityUtils;
import io.github.trip.shiv.dailydabba.web.service.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/customers/profile")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CUSTOMER')")
public class CustomerProfileController {

    private final CustomerService customerService;
    private final SecurityUtils securityUtils;

    /**
     * Create the authenticated user's customer profile.
     */
    @PostMapping(
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<CustomerResponse> createProfile(
            @Valid @RequestPart("request") CreateCustomerRequest request,
            @RequestPart(value = "image", required = false) MultipartFile profileImage
    ) {

        // Get the currently Authenticated User
        User user = securityUtils.getAuthenticatedUser();

        // TODO : Cloudinary Image Upload and setting it in Request is to be done here.

        // Create the Customer Profile
        CustomerProfile customerProfile =
                customerService.createCustomer(
                        user.getId(),
                        request
                );

        CustomerResponse response =
                CustomerResponse.fromEntity(customerProfile);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }



    /**
     * Update the authenticated customer's profile.
     */
    @PutMapping(
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<CustomerResponse> updateProfile(
            @Valid @RequestPart("request") UpdateCustomerRequest request,
            @RequestPart(value = "image", required = false) MultipartFile profileImage
    ) {

        System.out.println("================CALLED Update Profile ============");
        // Get the currently authenticated customer
        CustomerProfile currentProfile = securityUtils.getAuthenticatedCustomer();

        // Update the customer profile
        CustomerProfile updatedCustomer = customerService.updateCustomer(
                currentProfile.getId(),
                request
        );

        CustomerResponse response = CustomerResponse.fromEntity(updatedCustomer);
        return ResponseEntity.ok(response);
    }



    /**
     * Get the currently authenticated customer's profile.
     */
    @GetMapping
    public ResponseEntity<CustomerResponse> getMyProfile() {

        // Get the Authenticated User
        User user = securityUtils.getAuthenticatedUser();

        // Create the CustomerProfileResponse
        CustomerResponse response =
                CustomerResponse.fromEntity(
                        customerService.getCustomerByUserId(user.getId())
                );

        return ResponseEntity.ok(response);
    }
}