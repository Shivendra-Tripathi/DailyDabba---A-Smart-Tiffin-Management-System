package io.github.trip.shiv.dailydabba.web.service;

import io.github.trip.shiv.dailydabba.web.business.request.auth.LoginRequest;
import io.github.trip.shiv.dailydabba.web.business.request.user.CreateUserRequest;
import io.github.trip.shiv.dailydabba.web.business.response.auth.LoginResponse;
import io.github.trip.shiv.dailydabba.web.business.response.user.UserResponse;
import io.github.trip.shiv.dailydabba.web.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    private final UserService userService;

    @Override
    public LoginResponse login(LoginRequest request) {
        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                request.getEmail(),
                                request.getPassword()
                        )
                );

        User user = (User) authentication.getPrincipal();

        Objects.requireNonNull(user, "User is not authenticated");

        String accessToken = jwtService.generateToken(user);

        return LoginResponse.builder()
                .accessToken(accessToken)
                .tokenType("Bearer")
                .build();
    }

    @Override
    public UserResponse register(CreateUserRequest request) {
        return userService.createUser(request);
    }
}