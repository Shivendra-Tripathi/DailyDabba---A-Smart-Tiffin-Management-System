package io.github.trip.shiv.dailydabba.web.business.response.vendor;


import io.github.trip.shiv.dailydabba.web.business.response.address.AddressResponse;
import io.github.trip.shiv.dailydabba.web.entity.VendorProfile;
import io.github.trip.shiv.dailydabba.web.entity.enums.VendorVerificationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.UUID;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VendorProfileResponse {

    private UUID id;

    private String businessName;

    private String description;

    private AddressResponse businessAddress;

    private String fssaiLicenseNumber;

    private VendorVerificationStatus verificationStatus;

    private LocalTime orderCutoffTime;

    private BigDecimal averageRating;

    private Integer totalReviews;

    private boolean acceptingOrders;

    private String businessLogoUrl;

    public static VendorProfileResponse fromEntity(VendorProfile vendor) {
        return VendorProfileResponse.builder()
                .id(vendor.getId())
                .businessName(vendor.getBusinessName())
                .description(vendor.getDescription())
                .businessAddress(
                        vendor.getBusinessAddress() != null
                                ? AddressResponse.fromEntity(vendor.getBusinessAddress())
                                : null
                )
                .fssaiLicenseNumber(vendor.getFssaiLicenseNumber())
                .verificationStatus(vendor.getVerificationStatus())
                .orderCutoffTime(vendor.getOrderCutoffTime())
                .averageRating(vendor.getAverageRating())
                .totalReviews(vendor.getTotalReviews())
                .acceptingOrders(vendor.isAcceptingOrders())
                .businessLogoUrl(vendor.getBusinessLogoUrl())
                .build();
    }
}
