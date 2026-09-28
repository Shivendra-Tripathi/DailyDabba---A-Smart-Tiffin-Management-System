package io.github.trip.shiv.dailydabba.web.service;

import io.github.trip.shiv.dailydabba.web.business.exception.PasswordMismatchException;
import io.github.trip.shiv.dailydabba.web.business.exception.UserNotFoundException;
import io.github.trip.shiv.dailydabba.web.business.request.CreateUserRequest;
import io.github.trip.shiv.dailydabba.web.business.request.UpdateUserRequest;
import io.github.trip.shiv.dailydabba.web.business.response.internal.UserResponseInternal;
import io.github.trip.shiv.dailydabba.web.entity.User;
import io.github.trip.shiv.dailydabba.web.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public UserResponseInternal createUser(CreateUserRequest request) {

        String passwordHash = passwordEncoder.encode(request.getPassword());
        User user = request.toEntity(passwordHash);

        return UserResponseInternal.from(
                userRepository.save(user));
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponseInternal getUserById(UUID userId) {
        User user = userRepository.findById(userId).orElseThrow(
                () -> new UserNotFoundException("User with id: " + userId + " not found")
        );

        return UserResponseInternal.from(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponseInternal getUserByEmail(String email) {
        User user = userRepository.findByEmailIgnoreCase(email).orElseThrow(
                () -> new UserNotFoundException("User with email: " + email + " not found")
        );

        return UserResponseInternal.from(user);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmailIgnoreCase(email);
    }

    @Override
    @Transactional
    public UserResponseInternal updateUser(UUID userId, UpdateUserRequest request) {
        User user = getUserByIdInternal(userId);
        request.applyOn(user);
        return UserResponseInternal.from(user);
    }

    @Override
    @Transactional
    public void changePassword(
            UUID userId,
            String currentPassword,
            String newPassword) {

        User user = getUserByIdInternal(userId);

        if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
            throw new PasswordMismatchException(
                    "Current password does not match"
            );
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
    }

    @Override
    @Transactional
    public void enableUser(UUID userId) {
        User user = getUserByIdInternal(userId);
        user.setEnabled(true);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void disableUser(UUID userId) {
         User user = getUserByIdInternal(userId);
         user.setEnabled(false);
          userRepository.save(user);
    }

    @Override
    @Transactional
    public void deleteUser(UUID userId) {
         User user = getUserByIdInternal(userId);
         userRepository.delete(user);
    }


    /// ///////////////PRIVATE METHODS
    private User getUserByIdInternal(UUID userId) {
        User user = userRepository.findById(userId).orElseThrow(
                () -> new UserNotFoundException("User with id: " + userId + " not found")
        );

        return user;
    }


    private User getUserByEmailInternal(String email) {
        User user = userRepository.findByEmailIgnoreCase(email).orElseThrow(
                () -> new UserNotFoundException("User with email: " + email + " not found")
        );
        return user;
    }
}
