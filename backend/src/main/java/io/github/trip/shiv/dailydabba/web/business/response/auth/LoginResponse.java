package io.github.trip.shiv.dailydabba.web.business.response.auth;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {
    private String accessToken;
    private String tokenType;
}