
package io.github.trip.shiv.dailydabba.web.business.response.user;

import io.github.trip.shiv.dailydabba.web.entity.User;
import io.github.trip.shiv.dailydabba.web.entity.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {

    private UUID id;

    private String fullName;

    private String phoneNumber;

    private String email;

    private Role role;

    private boolean phoneVerified;

    private boolean emailVerified;

    private boolean enabled;

    private Instant createdAt;

    private Instant updatedAt;

    public static UserResponse from(User user) {
        if (user == null) {
            return null;
        }

        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhoneNumber())
                .email(user.getEmail())
                .role(user.getRole())
                .phoneVerified(user.isPhoneVerified())
                .emailVerified(user.isEmailVerified())
                .enabled(user.isEnabled())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}

