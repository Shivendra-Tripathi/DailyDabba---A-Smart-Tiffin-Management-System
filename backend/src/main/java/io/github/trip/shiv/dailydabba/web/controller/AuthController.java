package io.github.trip.shiv.dailydabba.web.controller;

import io.github.trip.shiv.dailydabba.web.business.request.auth.LoginRequest;
import io.github.trip.shiv.dailydabba.web.business.request.user.CreateUserRequest;
import io.github.trip.shiv.dailydabba.web.business.response.auth.LoginResponse;
import io.github.trip.shiv.dailydabba.web.business.response.user.UserResponse;
import io.github.trip.shiv.dailydabba.web.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping(
            value = "/register",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserResponse> register(
            @Valid @RequestPart("request") CreateUserRequest request,
            @RequestPart(value = "profileImage", required = false) MultipartFile image ) {


        //TODO : Image uploading ans setting the URL in request is done to be here.

        UserResponse response = authService.register(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {

        LoginResponse response = authService.login(request);

        return ResponseEntity.ok(response);
    }
}