package io.github.trip.shiv.dailydabba.web.business.request.customer;

import io.github.trip.shiv.dailydabba.web.entity.Address;
import io.github.trip.shiv.dailydabba.web.entity.CustomerProfile;
import io.github.trip.shiv.dailydabba.web.entity.enums.DietType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
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
public class CreateCustomerRequest {

    @NotNull
    private DietType dietPreference;

    @Valid
    @NotNull
    private Address defaultAddress;

    //NOTE : MUST SET USER EXPLICITLY
    public CustomerProfile toEntity() {
        return CustomerProfile.builder()
                .dietPreference(dietPreference)
                .defaultAddress(defaultAddress)
                .build();
    }
}