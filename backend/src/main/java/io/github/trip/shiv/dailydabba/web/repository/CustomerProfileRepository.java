package io.github.trip.shiv.dailydabba.web.repository;

import io.github.trip.shiv.dailydabba.web.entity.CustomerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CustomerProfileRepository extends JpaRepository<CustomerProfile, UUID> {

    Optional<CustomerProfile> findByUserId(UUID userId);

    Optional<CustomerProfile> findByUser_PhoneNumber(String phoneNumber);

    Optional<CustomerProfile> findByUser_EmailIgnoreCase(String email);

    boolean existsByUserId(UUID userId);
}
