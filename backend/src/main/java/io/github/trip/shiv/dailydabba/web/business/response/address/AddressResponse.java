package io.github.trip.shiv.dailydabba.web.business.response.address;

import io.github.trip.shiv.dailydabba.web.entity.Address;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressResponse {

    private String line1;

    private String line2;

    private String city;

    private String state;

    private String pincode;

    private String landmark;

    private Double latitude;

    private Double longitude;

    public static AddressResponse fromEntity(Address address) {
        if (address == null) {
            return null;
        }

        return AddressResponse.builder()
                .line1(address.getLine1())
                .line2(address.getLine2())
                .city(address.getCity())
                .state(address.getState())
                .pincode(address.getPincode())
                .landmark(address.getLandmark())
                .latitude(address.getLatitude())
                .longitude(address.getLongitude())
                .build();
    }
}
