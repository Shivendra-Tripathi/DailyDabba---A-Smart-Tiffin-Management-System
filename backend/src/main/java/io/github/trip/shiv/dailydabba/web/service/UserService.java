package io.github.trip.shiv.dailydabba.web.service;

import io.github.trip.shiv.dailydabba.web.business.request.CreateUserRequest;

import io.github.trip.shiv.dailydabba.web.business.request.UpdateUserRequest;
import io.github.trip.shiv.dailydabba.web.business.response.internal.UserResponseInternal;

import java.util.UUID;


public interface UserService {

    /**
     * Creates a new user account.
     */
    UserResponseInternal createUser(CreateUserRequest request);

    /**
     * Retrieves a user by their unique identifier.
     */
    UserResponseInternal getUserById(UUID userId);

    /**
     * Retrieves a user by their email address.
     */
    UserResponseInternal getUserByEmail(String email);

    /**
     * Checks whether a user with the given email already exists.
     */
    boolean existsByEmail(String email);

    /**
     * Updates common user/account information.
     */
    UserResponseInternal updateUser(UUID userId, UpdateUserRequest request);

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

