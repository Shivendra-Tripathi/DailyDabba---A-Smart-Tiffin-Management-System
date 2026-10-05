package io.github.trip.shiv.dailydabba.web.business.request.customer;

import io.github.trip.shiv.dailydabba.web.entity.Address;
import io.github.trip.shiv.dailydabba.web.entity.CustomerProfile;
import io.github.trip.shiv.dailydabba.web.entity.enums.DietType;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateCustomerRequest {

    private DietType dietPreference;

    @Valid
    private Address defaultAddress;

    public void applyOn(CustomerProfile customerProfile) {
            customerProfile.setDietPreference(dietPreference);
            customerProfile.setDefaultAddress(defaultAddress);
    }
}