package io.github.trip.shiv.dailydabba.web.service;


import io.github.trip.shiv.dailydabba.web.business.request.auth.LoginRequest;
import io.github.trip.shiv.dailydabba.web.business.request.user.CreateUserRequest;
import io.github.trip.shiv.dailydabba.web.business.response.auth.LoginResponse;
import io.github.trip.shiv.dailydabba.web.business.response.user.UserResponse;

public interface AuthService {

    LoginResponse login(LoginRequest request);

    UserResponse register(CreateUserRequest request);
}