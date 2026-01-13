package com.cs308_team_3.sabanci_pharmacy.dto.Support;

import lombok.Data;

@Data
public class ChatMessageDto {
    private String sessionId;
    private String senderRole; // "CUSTOMER" or "AGENT"
    private String content;
    private String attachmentUrl; // Optional
}
