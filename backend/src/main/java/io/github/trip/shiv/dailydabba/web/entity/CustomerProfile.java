package io.github.trip.shiv.dailydabba.web.entity;

import io.github.trip.shiv.dailydabba.web.entity.enums.DietType;
import jakarta.persistence.AttributeOverride;
import jakarta.persistence.AttributeOverrides;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Entity
@Table(name = "customer_profiles")
public class CustomerProfile extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "diet_preference", length = 20)
    private DietType dietPreference;

//    @AttributeOverrides({
//            @AttributeOverride(name = "line1", column = @Column(name = "default_line1")),
//            @AttributeOverride(name = "line2", column = @Column(name = "default_line2")),
//            @AttributeOverride(name = "city", column = @Column(name = "default_city")),
//            @AttributeOverride(name = "state", column = @Column(name = "default_state")),
//            @AttributeOverride(name = "pincode", column = @Column(name = "default_pincode")),
//            @AttributeOverride(name = "landmark", column = @Column(name = "default_landmark")),
//            @AttributeOverride(name = "latitude", column = @Column(name = "default_latitude")),
//            @AttributeOverride(name = "longitude", column = @Column(name = "default_longitude"))
//    })
    @Embedded
    private Address defaultAddress;

    /** Wallet used for refunds and quick checkout. */
    @Builder.Default
    @Column(name = "wallet_balance", precision = 10, scale = 2, nullable = false)
    private BigDecimal walletBalance = BigDecimal.ZERO;
}
