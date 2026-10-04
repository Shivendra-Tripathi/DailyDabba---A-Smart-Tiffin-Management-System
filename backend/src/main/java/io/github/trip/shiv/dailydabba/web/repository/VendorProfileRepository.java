package io.github.trip.shiv.dailydabba.web.repository;

import io.github.trip.shiv.dailydabba.web.entity.VendorProfile;
import io.github.trip.shiv.dailydabba.web.entity.enums.VendorVerificationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * JpaSpecificationExecutor lets the service layer compose dynamic filters
 * (city, diet type via joined menu items, price range, rating threshold...)
 * for vendor search/browse screens without a repository method per combination.
 */
@Repository
public interface VendorProfileRepository extends JpaRepository<VendorProfile, UUID>,
        JpaSpecificationExecutor<VendorProfile> {

    Optional<VendorProfile> findByUserId(UUID userId);

    boolean existsByUserId(UUID userId);

    List<VendorProfile> findByVerificationStatus(VendorVerificationStatus status);

    Page<VendorProfile> findByAcceptingOrdersTrueAndVerificationStatus(
            VendorVerificationStatus status, Pageable pageable);

    Page<VendorProfile> findByBusinessNameContainingIgnoreCaseAndAcceptingOrdersTrueAndVerificationStatus(
            String name,
            VendorVerificationStatus status,
            Pageable pageable
    );

    @Query("""
    select v
    from VendorProfile v
    where v.acceptingOrders = true
      and v.verificationStatus = :status
    order by v.averageRating desc
    """)
    Page<VendorProfile> findTopRatedVendors(
            @Param("status") VendorVerificationStatus status,
            Pageable pageable
    );
}
