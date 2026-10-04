package io.github.trip.shiv.dailydabba.web.business.request.user;

import io.github.trip.shiv.dailydabba.web.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.URL;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateUserRequest {

    @Size(max = 120, message = "Full name must not exceed 120 characters")
    private String fullName;

    @Pattern(
            regexp = "^[6-9]\\d{9}$",
            message = "Phone number must be a valid 10-digit Indian mobile number"
    )
    private String phoneNumber;

    @Email(message = "Email must be valid")
    @Size(max = 150, message = "Email must not exceed 150 characters")
    private String email;

    @URL(message = "Image url must not be null")
    private String imageUrl;

    public void applyOn(User user) {
        if (fullName != null) {
            user.setFullName(fullName);
        }

        if (phoneNumber != null) {
            user.setPhoneNumber(phoneNumber);
        }

        if (email != null) {
            user.setEmail(email);
        }

        if(imageUrl != null){
            user.setImageUrl(imageUrl);
        }
    }
}

