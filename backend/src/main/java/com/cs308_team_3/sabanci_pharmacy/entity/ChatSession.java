package com.cs308_team_3.sabanci_pharmacy.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "chat_sessions")
@Data
public class ChatSession {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    // "WAITING", "ACTIVE", "CLOSED"
    private String status = "WAITING";

    // For Guest users, we might just store a temporary name or session ID
    private String guestId;
    
    // If the user is logged in, link them
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // The support agent assigned to this chat
    @ManyToOne
    @JoinColumn(name = "agent_id")
    private User assignedAgent;

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL)
    private List<ChatMessage> messages = new ArrayList<>();

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
