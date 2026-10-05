package io.github.trip.shiv.dailydabba.web.business.request.vendor;

import io.github.trip.shiv.dailydabba.web.entity.Address;
import io.github.trip.shiv.dailydabba.web.entity.VendorProfile;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateVendorRequest {

    @Size(max = 150, message = "Business name must not exceed 150 characters")
    private String businessName;

    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;

    @Valid
    private Address businessAddress;

    @Size(max = 30, message = "FSSAI license number must not exceed 30 characters")
    private String fssaiLicenseNumber;

    private LocalTime orderCutoffTime;

    /*
    Updates the Vendor
     */
    public void applyOn(VendorProfile vendorProfile) {

        vendorProfile.setBusinessName(businessName);

        vendorProfile.setDescription(description);
        vendorProfile.setBusinessAddress(businessAddress);

        vendorProfile.setFssaiLicenseNumber(fssaiLicenseNumber);
        vendorProfile.setOrderCutoffTime(orderCutoffTime);

    }
}