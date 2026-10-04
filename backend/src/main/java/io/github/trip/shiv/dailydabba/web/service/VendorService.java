package io.github.trip.shiv.dailydabba.web.service;

import io.github.trip.shiv.dailydabba.web.business.request.vendor.CreateVendorRequest;
import io.github.trip.shiv.dailydabba.web.business.request.vendor.UpdateVendorRequest;
import io.github.trip.shiv.dailydabba.web.entity.VendorProfile;
import io.github.trip.shiv.dailydabba.web.entity.enums.VendorVerificationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface VendorService {

    /**
     * Creates a vendor profile for an existing user.
     */
    VendorProfile createVendor(UUID userId, CreateVendorRequest request);

    /**
     * Gets a vendor by vendor profile ID.
     */
    VendorProfile getVendorById(UUID vendorId);

    /**
     * Gets the vendor profile associated with a user.
     */
    VendorProfile getVendorByUserId(UUID userId);

    /**
     * Updates vendor profile information.
     */
    VendorProfile updateVendor(UUID vendorId, UpdateVendorRequest request);

    /**
     * Deletes a vendor profile.
     */
    void deleteVendor(UUID vendorId);

    /**
     * Checks whether a user already has a vendor profile.
     */
    boolean existsByUserId(UUID userId);

    /**
     * Gets vendors by verification status.
     */
    List<VendorProfile> getVendorsByVerificationStatus(
            VendorVerificationStatus status);

    /**
     * Gets verified vendors currently accepting orders.
     */
    Page<VendorProfile> getAcceptingVendors(Pageable pageable);

    /**
     * Searches accepting vendors by business name.
     */
    Page<VendorProfile> searchVendorsByName(
            String name,
            Pageable pageable);

    /**
     * Gets the highest-rated vendors.
     */
    Page<VendorProfile> getTopRatedVendors(Pageable pageable);

    /**
     * Updates the vendor verification status.
     */
    VendorProfile updateVerificationStatus(
            UUID vendorId,
            VendorVerificationStatus status);

    /**
     * Enables/disables order acceptance for a vendor.
     */
    VendorProfile updateAcceptingOrders(
            UUID vendorId,
            boolean acceptingOrders);
}