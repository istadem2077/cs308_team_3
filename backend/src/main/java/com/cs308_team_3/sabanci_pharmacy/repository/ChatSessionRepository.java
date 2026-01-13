package com.cs308_team_3.sabanci_pharmacy.repository;

import com.cs308_team_3.sabanci_pharmacy.entity.ChatSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatSessionRepository extends JpaRepository<ChatSession, String> {
    List<ChatSession> findByStatus(String status);
    List<ChatSession> findByAssignedAgentId(Integer agentId);
}
