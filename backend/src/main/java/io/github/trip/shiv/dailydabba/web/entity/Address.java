package io.github.trip.shiv.dailydabba.web.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Embeddable value object - not an entity in its own right. Reused inside
 * VendorProfile (business address), CustomerProfile (default address) and
 * Order (snapshot of the delivery address at order time).
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Embeddable
public class Address {

    @Column(length = 150)
    private String line1;

    @Column(length = 150)
    private String line2;

    @Column(length = 60)
    private String city;

    @Column(length = 60)
    private String state;

    @Column(length = 10)
    private String pincode;

    @Column(length = 100)
    private String landmark;

    private Double latitude;

    private Double longitude;
}
