
package io.github.trip.shiv.dailydabba.web.business.request.vendor;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.github.trip.shiv.dailydabba.web.entity.Address;
import io.github.trip.shiv.dailydabba.web.entity.VendorProfile;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.URL;

import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateVendorRequest {

    @NotBlank(message = "Business name is required")
    @Size(max = 150, message = "Business name must not exceed 150 characters")
    private String businessName;

    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;

    @Valid
    private Address businessAddress;

    @Size(max = 30, message = "FSSAI license number must not exceed 30 characters")
    private String fssaiLicenseNumber;

    private LocalTime orderCutoffTime;

    @URL(message = "Business Logo Url must not be a valid URL")
    @JsonIgnore
    private String businessLogoUrl;



    /*
    Returns the VendorProfile Entity based on the request data
    Note : USER IS NOT SET FOR THE VENDORPROFILE
     */
    public VendorProfile toEntity() {
        return VendorProfile.builder()
                .businessName(businessName)
                .description(description)
                .businessAddress(businessAddress)
                .fssaiLicenseNumber(fssaiLicenseNumber)
                .orderCutoffTime(orderCutoffTime)
                .businessLogoUrl(businessLogoUrl)
                .build();
    }
}
