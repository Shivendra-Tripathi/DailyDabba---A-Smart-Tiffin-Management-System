package io.github.trip.shiv.dailydabba.web.repository;

import io.github.trip.shiv.dailydabba.web.entity.PollOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PollOptionRepository extends JpaRepository<PollOption, UUID> {

    List<PollOption> findByPollId(UUID pollId);

    List<PollOption> findByPollIdOrderByVoteCountDesc(UUID pollId);

    /**
     * Atomic +1 on the denormalized counter - avoids a read-modify-write race
     * when many customers vote around the same time.
     */
    @Modifying
    @Query("update PollOption p set p.voteCount = p.voteCount + 1 where p.id = :optionId")
    int incrementVoteCount(@Param("optionId") UUID optionId);
}
