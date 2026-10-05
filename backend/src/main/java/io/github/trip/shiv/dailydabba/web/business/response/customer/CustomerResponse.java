package io.github.trip.shiv.dailydabba.web.business.response.customer;


import io.github.trip.shiv.dailydabba.web.entity.Address;
import io.github.trip.shiv.dailydabba.web.entity.CustomerProfile;
import io.github.trip.shiv.dailydabba.web.entity.enums.DietType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerResponse {

    private UUID id;

    private DietType dietPreference;

    private Address defaultAddress;

    public static CustomerResponse fromEntity(CustomerProfile customerProfile) {
        return CustomerResponse.builder()
                .id(customerProfile.getId())
                .dietPreference(customerProfile.getDietPreference())
                .defaultAddress(customerProfile.getDefaultAddress())
                .build();
    }
}