package io.github.trip.shiv.dailydabba.web.entity;

import io.github.trip.shiv.dailydabba.web.entity.enums.Role;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

/**
 * Single auth identity table for everyone (feature #1 and #2: user and
 * vendor register the exact same way - phone + email + password). What role
 * they play, and the role-specific data, lives in CustomerProfile /
 * VendorProfile, each in a 1:1 relationship with this row.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Entity
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(name = "uk_user_phone", columnNames = "phone_number"),
        @UniqueConstraint(name = "uk_user_email", columnNames = "email")
})
public class User extends BaseEntity {

    @Column(name = "full_name", nullable = false, length = 120)
    private String fullName;

    @Column(name = "phone_number", nullable = false, length = 15)
    private String phoneNumber;

    @Column(name = "email", nullable = false, length = 150)
    private String email;

    /** Never store plaintext - this holds a BCrypt/Argon2 hash. */
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 20)
    private Role role;

    @Builder.Default
    @Column(name = "phone_verified", nullable = false)
    private boolean phoneVerified = false;

    @Builder.Default
    @Column(name = "email_verified", nullable = false)
    private boolean emailVerified = false;

    @Builder.Default
    @Column(name = "enabled", nullable = false)
    private boolean enabled = true;

    /** Push token for order/poll/consent notifications. */
    @Column(name = "fcm_token")
    private String fcmToken;


    /* Stores the url of the profile picture */
    @Column(name = "profile_picture_url" , nullable = true)
    private String profilePictureUrl ;

}
