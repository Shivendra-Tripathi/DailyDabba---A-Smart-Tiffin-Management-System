package io.github.trip.shiv.dailydabba.web.service;

import io.github.trip.shiv.dailydabba.web.business.exception.PasswordMismatchException;
import io.github.trip.shiv.dailydabba.web.business.exception.UserNotFoundException;
import io.github.trip.shiv.dailydabba.web.business.request.user.CreateUserRequest;
import io.github.trip.shiv.dailydabba.web.business.request.user.UpdateUserRequest;
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
    public User getUserByEmail(String email) {
        return userRepository.findByEmailIgnoreCase(email).orElseThrow(
                () -> new UserNotFoundException("User with email: " + email + " not found")
        );
    }

    @Override
    public User getUserById(UUID id) {
        return userRepository.findById(id).orElseThrow(
                () -> new UserNotFoundException("User with id: " + id + " not found")
        );

    }

    @Override
    @Transactional
    public User createUser(CreateUserRequest request) {

        String passwordHash = passwordEncoder.encode(request.getPassword());
        User user = request.toEntity(passwordHash);

        return userRepository.save(user);
    }


    @Override
    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmailIgnoreCase(email);
    }

    @Override
    @Transactional
    public User updateUser(UUID userId, UpdateUserRequest request) {
        User user = getUserById(userId);
        request.applyOn(user);
        return user;
    }

    @Override
    @Transactional
    public void changePassword(
            UUID userId,
            String currentPassword,
            String newPassword) {

        User user = getUserById(userId);

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
        User user = getUserById(userId);
        user.setEnabled(true);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void disableUser(UUID userId) {
         User user = getUserById(userId);
         user.setEnabled(false);
          userRepository.save(user);
    }

    @Override
    @Transactional
    public void deleteUser(UUID userId) {
         User user = getUserById(userId);
         userRepository.delete(user);
    }

}
