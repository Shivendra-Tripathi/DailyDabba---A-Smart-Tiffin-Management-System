package io.github.trip.shiv.dailydabba.web.business.request.auth;

import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {
    private  String email;
    private  String password;
}
