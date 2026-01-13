package com.cs308_team_3.sabanci_pharmacy.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages")
@Data
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "session_id", nullable = false)
    private ChatSession session;

    // "CUSTOMER", "AGENT", "SYSTEM"
    private String senderRole; 
    
    @Column(columnDefinition = "TEXT")
    private String content;

    private String attachmentUrl; // For PDFs, Images, Videos

    @CreationTimestamp
    private LocalDateTime timestamp;
}
