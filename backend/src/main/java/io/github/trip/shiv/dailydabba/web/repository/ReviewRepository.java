package io.github.trip.shiv.dailydabba.web.repository;

import io.github.trip.shiv.dailydabba.web.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ReviewRepository extends JpaRepository<Review, UUID> {

    Optional<Review> findByOrderId(UUID orderId);

    boolean existsByOrderId(UUID orderId);

    Page<Review> findByVendorIdOrderByCreatedAtDesc(UUID vendorId, Pageable pageable);

    Page<Review> findByCustomerIdOrderByCreatedAtDesc(UUID customerId, Pageable pageable);

    /** Used after inserting/updating a review to recompute VendorProfile.averageRating. */
    @Query("select avg(r.rating) from Review r where r.vendor.id = :vendorId")
    Double findAverageRatingForVendor(@Param("vendorId") UUID vendorId);

    long countByVendorId(UUID vendorId);
}
