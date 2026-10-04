package io.github.trip.shiv.dailydabba.web.service;

import io.github.trip.shiv.dailydabba.web.business.request.user.CreateUserRequest;

import io.github.trip.shiv.dailydabba.web.business.request.user.UpdateUserRequest;
import io.github.trip.shiv.dailydabba.web.business.response.user.UserResponse;
import io.github.trip.shiv.dailydabba.web.entity.User;

import java.util.UUID;


public interface UserService {



    /**
     * Creates a new user account.
     */
    User createUser(CreateUserRequest request);

    /**
     * Retrieves a user by their unique identifier.
     */
    User getUserById(UUID userId);

    /**
     * Retrieves a user by their email address.
     */
    User getUserByEmail(String email);



    /**
     * Checks whether a user with the given email already exists.
     */
    boolean existsByEmail(String email);

    /**
     * Updates common user/account information.
     */
    User updateUser(UUID userId, UpdateUserRequest request);

    /**
     * Changes the user's password.
     */
    void changePassword(
            UUID userId,
            String currentPassword,
            String newPassword
    );

    /**
     * Enables a user account.
     */
    void enableUser(UUID userId);

    /**
     * Disables a user account.
     */
    void disableUser(UUID userId);

    /**
     * Deletes a user account.
     */
    void deleteUser(UUID userId);
}

