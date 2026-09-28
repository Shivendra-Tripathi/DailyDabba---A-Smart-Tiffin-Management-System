package io.github.trip.shiv.dailydabba.web.repository;

import io.github.trip.shiv.dailydabba.web.entity.Poll;
import io.github.trip.shiv.dailydabba.web.entity.enums.PollStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface PollRepository extends JpaRepository<Poll, UUID> {

    List<Poll> findByVendorId(UUID vendorId);

    List<Poll> findByVendorIdAndStatus(UUID vendorId, PollStatus status);

    /** Feeds a scheduled job that tallies votes and closes polls whose window has elapsed. */
    List<Poll> findByStatusAndVotingClosesAtBefore(PollStatus status, Instant instant);

    List<Poll> findByTargetDateAndStatus(LocalDate targetDate, PollStatus status);
}
