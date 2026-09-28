package io.github.trip.shiv.dailydabba.web.repository;

import io.github.trip.shiv.dailydabba.web.entity.PollVote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PollVoteRepository extends JpaRepository<PollVote, UUID> {

    Optional<PollVote> findByPollIdAndCustomerId(UUID pollId, UUID customerId);

    /** Service layer checks this before allowing a vote - backed also by the DB unique constraint. */
    boolean existsByPollIdAndCustomerId(UUID pollId, UUID customerId);

    List<PollVote> findByPollId(UUID pollId);

    long countByPollIdAndOptionId(UUID pollId, UUID optionId);
}
